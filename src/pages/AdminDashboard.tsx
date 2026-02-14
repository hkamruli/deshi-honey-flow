import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Plus, Pencil, Trash2, Save, X } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import OrderTable, { STATUS_OPTIONS, type OrderRow } from "@/components/admin/OrderTable";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import AbandonedCarts from "@/components/admin/AbandonedCarts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

type FilterMode = "all" | "uncompleted" | (typeof STATUS_OPTIONS)[number];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (filter === "uncompleted") {
      query = query.not("status", "in", '("delivered","cancelled")');
    } else if (filter !== "all") {
      query = query.eq("status", filter);
    }
    const { data } = await query;
    setOrders((data as any[]) || []);
    setLoading(false);
  }, [filter]);

  const fetchAnalytics = useCallback(async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const since = thirtyDaysAgo.toISOString();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todaySince = todayStart.toISOString();

    const [{ data: periodOrders }, { data: recent }, { data: todayVisitors }, { data: totalVisitors }, { data: settingsData }] = await Promise.all([
      supabase.from("orders").select("total_amount, delivery_charge, status, unit_price, quantity").gte("created_at", since),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
      supabase.from("visitor_analytics").select("session_id").eq("event_type", "page_view").gte("created_at", todaySince),
      supabase.from("visitor_analytics").select("session_id").eq("event_type", "page_view").gte("created_at", since),
      supabase.from("settings").select("key, value"),
    ]);

    const settingsMap: Record<string, string> = {};
    (settingsData || []).forEach((s: any) => { settingsMap[s.key] = s.value; });

    const allOrders = periodOrders || [];
    const activeOrders = allOrders.filter((o: any) => o.status !== "cancelled");
    const revenue = activeOrders.reduce((s: number, o: any) => s + o.total_amount, 0);
    const deliveryRevenue = activeOrders.reduce((s: number, o: any) => s + (o.delivery_charge || 0), 0);

    // Calculate total discount given & free delivery given
    const discountPerOrder = Number(settingsMap.discount_amount || 0);
    const freeDeliveryEnabled = settingsMap.free_delivery_enabled !== "false";
    const insideDhaka = Number(settingsMap.delivery_charge_inside_dhaka || 100);
    const outsideDhaka = Number(settingsMap.delivery_charge_outside_dhaka || 150);
    
    // Total discount = (original_price - price) * qty for each active order + discount_amount per order
    const totalDiscountGiven = activeOrders.reduce((s: number, o: any) => {
      return s + (discountPerOrder * o.quantity);
    }, 0);
    
    // Total free delivery = sum of delivery charges waived for active orders
    const totalFreeDeliveryGiven = freeDeliveryEnabled
      ? activeOrders.reduce((s: number, o: any) => {
          // If delivery_charge is 0 and free delivery is enabled, estimate the waived amount
          if (o.delivery_charge === 0) {
            // Use average of inside/outside dhaka as estimate
            return s + outsideDhaka; 
          }
          return s;
        }, 0)
      : 0;

    // Unique daily visitors by session_id
    const uniqueTodayVisitors = new Set((todayVisitors || []).map((v: any) => v.session_id)).size;
    // Unique 30-day visitors
    const uniqueTotalVisitors = new Set((totalVisitors || []).map((v: any) => v.session_id)).size;
    // Conversion rate = orders / unique visitors * 100
    const conversionRate = uniqueTotalVisitors > 0
      ? ((allOrders.length / uniqueTotalVisitors) * 100).toFixed(1)
      : "0";

    setRecentOrders((recent as any[]) || []);
    setAnalytics({
      totalOrders: allOrders.length,
      revenue,
      deliveryRevenue,
      totalDiscountGiven,
      totalFreeDeliveryGiven,
      pending: allOrders.filter((o: any) => o.status === "pending").length,
      confirmed: allOrders.filter((o: any) => o.status === "confirmed").length,
      processing: allOrders.filter((o: any) => o.status === "processing").length,
      shipped: allOrders.filter((o: any) => o.status === "shipped").length,
      delivered: allOrders.filter((o: any) => o.status === "delivered").length,
      cancelled: allOrders.filter((o: any) => o.status === "cancelled").length,
      todayVisitors: uniqueTodayVisitors,
      conversionRate,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) navigate("/admin/login");
      else {
        supabase.from("user_roles").select("role").eq("user_id", data.user.id).single()
          .then(({ data: roles }) => {
            if (!roles || roles.role !== "admin") navigate("/admin/login");
          });
      }
    });
    fetchAnalytics();
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus } as any).eq("id", id);
    fetchOrders();
    fetchAnalytics();
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const filterButtons: { key: FilterMode; label: string }[] = [
    { key: "all", label: "সব" },
    { key: "uncompleted", label: "🔴 অসম্পন্ন" },
    ...STATUS_OPTIONS.map((s) => ({ key: s as FilterMode, label: s })),
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">ড্যাশবোর্ড</h2>
              <p className="text-sm text-muted-foreground">গত ৩০ দিনের সারসংক্ষেপ</p>
            </div>
            <AdminStats analytics={analytics} />
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">📋 সাম্প্রতিক অর্ডার</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <p className="text-center py-6 text-muted-foreground">কোনো অর্ডার নেই</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead>অর্ডার নং</TableHead>
                          <TableHead>গ্রাহক</TableHead>
                          <TableHead>পরিমাণ</TableHead>
                          <TableHead>স্ট্যাটাস</TableHead>
                          <TableHead className="text-right">মূল্য</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOrders.slice(0, 5).map((order) => (
                          <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedOrder(order)}>
                            <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                            <TableCell className="font-medium">{order.customer_name}</TableCell>
                            <TableCell className="text-sm">{order.quantity}x</TableCell>
                            <TableCell>
                              <Badge className={`${STATUS_STYLES[order.status] || ""} border-0 text-[10px]`}>{order.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-bold">৳{order.total_amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">অর্ডার ম্যানেজমেন্ট</h2>
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map((f) => (
                <Button key={f.key} size="sm" variant={filter === f.key ? "default" : "outline"} onClick={() => setFilter(f.key)} className="capitalize rounded-full">
                  {f.label}
                </Button>
              ))}
            </div>
            <OrderTable orders={orders} loading={loading} onStatusChange={updateStatus} onViewOrder={setSelectedOrder} />
          </div>
        );

      case "products":
        return <div className="space-y-6"><h2 className="text-2xl font-bold">প্রোডাক্ট ম্যানেজমেন্ট</h2><ProductsSection /></div>;
      case "testimonials":
        return <div className="space-y-6"><h2 className="text-2xl font-bold">টেস্টিমোনিয়াল</h2><TestimonialsSection /></div>;
      case "offers":
        return <div className="space-y-6"><h2 className="text-2xl font-bold">অফার ও বোনাস</h2><OffersSection /></div>;
      case "abandoned":
        return <div className="space-y-6"><h2 className="text-2xl font-bold">অসম্পূর্ণ অর্ডার</h2><AbandonedCarts /></div>;
      case "settings":
        return <div className="space-y-6"><h2 className="text-2xl font-bold">সেটিংস</h2><SettingsSection /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 border-b border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-10 md:ml-0">
              <span className="text-lg">📊</span>
              <h1 className="text-base font-bold">আডমিন প্যানেল</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { fetchOrders(); fetchAnalytics(); }} className="text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="p-4 md:p-8">{renderContent()}</div>
        <OrderDetailModal order={selectedOrder} open={!!selectedOrder} onClose={() => setSelectedOrder(null)} onStatusChange={updateStatus} />
      </main>
    </div>
  );
};

// ===================== PRODUCTS SECTION =====================
const ProductsSection = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", name_bn: "", size: "", size_bn: "", price: 0, original_price: 0, badge_bn: "", sort_order: 0, is_active: true });

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from("product_variations").select("*").order("sort_order");
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const startEdit = (p: any) => { setEditingId(p.id); setEditData({ ...p }); };
  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const saveEdit = async () => {
    const { id, created_at, ...rest } = editData;
    await supabase.from("product_variations").update(rest as any).eq("id", editingId!);
    toast({ title: "প্রোডাক্ট আপডেট হয়েছে" });
    setEditingId(null);
    fetchProducts();
  };

  const addProduct = async () => {
    await supabase.from("product_variations").insert(newProduct as any);
    toast({ title: "নতুন প্রোডাক্ট যোগ হয়েছে" });
    setShowAdd(false);
    setNewProduct({ name: "", name_bn: "", size: "", size_bn: "", price: 0, original_price: 0, badge_bn: "", sort_order: 0, is_active: true });
    fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("এই প্রোডাক্ট মুছে ফেলতে চান?")) return;
    await supabase.from("product_variations").delete().eq("id", id);
    toast({ title: "প্রোডাক্ট মুছে ফেলা হয়েছে" });
    fetchProducts();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("product_variations").update({ is_active: !current } as any).eq("id", id);
    fetchProducts();
  };

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> নতুন প্রোডাক্ট</Button>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম (বাংলা)</TableHead>
                  <TableHead>সাইজ</TableHead>
                  <TableHead className="text-right">মূল্য</TableHead>
                  <TableHead className="text-right">আসল মূল্য</TableHead>
                  <TableHead>ব্যাজ</TableHead>
                  <TableHead>ক্রম</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    {editingId === p.id ? (
                      <>
                        <TableCell><Input className="h-8 text-xs" value={editData.name_bn} onChange={(e) => setEditData({ ...editData, name_bn: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.size_bn} onChange={(e) => setEditData({ ...editData, size_bn: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs w-20" type="number" value={editData.price} onChange={(e) => setEditData({ ...editData, price: +e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs w-20" type="number" value={editData.original_price || ""} onChange={(e) => setEditData({ ...editData, original_price: +e.target.value || null })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.badge_bn || ""} onChange={(e) => setEditData({ ...editData, badge_bn: e.target.value || null })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs w-16" type="number" value={editData.sort_order} onChange={(e) => setEditData({ ...editData, sort_order: +e.target.value })} /></TableCell>
                        <TableCell><Switch checked={editData.is_active} onCheckedChange={(v) => setEditData({ ...editData, is_active: v })} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={saveEdit}><Save className="h-4 w-4 text-emerald-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{p.name_bn}</TableCell>
                        <TableCell>{p.size_bn}</TableCell>
                        <TableCell className="text-right font-bold">৳{p.price}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{p.original_price ? `৳${p.original_price}` : "—"}</TableCell>
                        <TableCell>{p.badge_bn || "—"}</TableCell>
                        <TableCell>{p.sort_order}</TableCell>
                        <TableCell>
                          <Badge variant={p.is_active ? "default" : "secondary"} className="text-[10px] cursor-pointer" onClick={() => toggleActive(p.id, p.is_active)}>
                            {p.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(p)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>নতুন প্রোডাক্ট যোগ করুন</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">নাম (English)</Label><Input className="mt-1" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} /></div>
              <div><Label className="text-xs">নাম (বাংলা)</Label><Input className="mt-1" value={newProduct.name_bn} onChange={(e) => setNewProduct({ ...newProduct, name_bn: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">সাইজ (English)</Label><Input className="mt-1" value={newProduct.size} onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })} /></div>
              <div><Label className="text-xs">সাইজ (বাংলা)</Label><Input className="mt-1" value={newProduct.size_bn} onChange={(e) => setNewProduct({ ...newProduct, size_bn: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">মূল্য (৳)</Label><Input type="number" className="mt-1" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })} /></div>
              <div><Label className="text-xs">আসল মূল্য (৳)</Label><Input type="number" className="mt-1" value={newProduct.original_price} onChange={(e) => setNewProduct({ ...newProduct, original_price: +e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">ব্যাজ (বাংলা)</Label><Input className="mt-1" value={newProduct.badge_bn} onChange={(e) => setNewProduct({ ...newProduct, badge_bn: e.target.value })} /></div>
              <div><Label className="text-xs">ক্রম</Label><Input type="number" className="mt-1" value={newProduct.sort_order} onChange={(e) => setNewProduct({ ...newProduct, sort_order: +e.target.value })} /></div>
            </div>
            <Button onClick={addProduct} className="w-full"><Plus className="h-4 w-4 mr-1" /> যোগ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ===================== TESTIMONIALS SECTION =====================
const TestimonialsSection = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", district: "", review_text: "", rating: 5, is_active: true, is_verified: true });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (t: any) => { setEditingId(t.id); setEditData({ ...t }); };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async () => {
    const { id, created_at, ...rest } = editData;
    await supabase.from("testimonials").update(rest as any).eq("id", editingId!);
    toast({ title: "টেস্টিমোনিয়াল আপডেট হয়েছে" });
    setEditingId(null);
    fetchData();
  };

  const addItem = async () => {
    await supabase.from("testimonials").insert(newItem as any);
    toast({ title: "নতুন টেস্টিমোনিয়াল যোগ হয়েছে" });
    setShowAdd(false);
    setNewItem({ name: "", district: "", review_text: "", rating: 5, is_active: true, is_verified: true });
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("এই টেস্টিমোনিয়াল মুছে ফেলতে চান?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("testimonials").update({ is_active: !current } as any).eq("id", id);
    fetchData();
  };

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> নতুন টেস্টিমোনিয়াল</Button>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম</TableHead>
                  <TableHead>জেলা</TableHead>
                  <TableHead>রিভিউ</TableHead>
                  <TableHead>রেটিং</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((t) => (
                  <TableRow key={t.id}>
                    {editingId === t.id ? (
                      <>
                        <TableCell><Input className="h-8 text-xs" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.district} onChange={(e) => setEditData({ ...editData, district: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.review_text} onChange={(e) => setEditData({ ...editData, review_text: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs w-16" type="number" min={1} max={5} value={editData.rating} onChange={(e) => setEditData({ ...editData, rating: +e.target.value })} /></TableCell>
                        <TableCell><Switch checked={editData.is_active} onCheckedChange={(v) => setEditData({ ...editData, is_active: v })} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={saveEdit}><Save className="h-4 w-4 text-emerald-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell>{t.district}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-sm">{t.review_text}</TableCell>
                        <TableCell>{"⭐".repeat(t.rating)}</TableCell>
                        <TableCell>
                          <Badge variant={t.is_active ? "default" : "secondary"} className="text-[10px] cursor-pointer" onClick={() => toggleActive(t.id, t.is_active)}>
                            {t.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(t)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>নতুন টেস্টিমোনিয়াল</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">নাম</Label><Input className="mt-1" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></div>
              <div><Label className="text-xs">জেলা</Label><Input className="mt-1" value={newItem.district} onChange={(e) => setNewItem({ ...newItem, district: e.target.value })} /></div>
            </div>
            <div><Label className="text-xs">রিভিউ</Label><textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1 min-h-[60px]" value={newItem.review_text} onChange={(e) => setNewItem({ ...newItem, review_text: e.target.value })} /></div>
            <div><Label className="text-xs">রেটিং (১-৫)</Label><Input type="number" min={1} max={5} className="mt-1" value={newItem.rating} onChange={(e) => setNewItem({ ...newItem, rating: +e.target.value })} /></div>
            <Button onClick={addItem} className="w-full"><Plus className="h-4 w-4 mr-1" /> যোগ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ===================== OFFERS SECTION =====================
const OffersSection = () => {
  const { toast } = useToast();
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", name_bn: "", value: 0, display_mode: "global", is_active: true });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("bonuses").select("*").order("created_at", { ascending: false });
    setBonuses(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (b: any) => { setEditingId(b.id); setEditData({ ...b }); };
  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async () => {
    const { id, created_at, ...rest } = editData;
    await supabase.from("bonuses").update(rest as any).eq("id", editingId!);
    toast({ title: "অফার আপডেট হয়েছে" });
    setEditingId(null);
    fetchData();
  };

  const addItem = async () => {
    await supabase.from("bonuses").insert(newItem as any);
    toast({ title: "নতুন অফার যোগ হয়েছে" });
    setShowAdd(false);
    setNewItem({ name: "", name_bn: "", value: 0, display_mode: "global", is_active: true });
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("এই অফার মুছে ফেলতে চান?")) return;
    await supabase.from("bonuses").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchData();
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from("bonuses").update({ is_active: !current } as any).eq("id", id);
    fetchData();
  };

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <>
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> নতুন অফার</Button>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>নাম (বাংলা)</TableHead>
                  <TableHead>নাম (English)</TableHead>
                  <TableHead>মান</TableHead>
                  <TableHead>মোড</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bonuses.map((b) => (
                  <TableRow key={b.id}>
                    {editingId === b.id ? (
                      <>
                        <TableCell><Input className="h-8 text-xs" value={editData.name_bn} onChange={(e) => setEditData({ ...editData, name_bn: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs w-20" type="number" value={editData.value} onChange={(e) => setEditData({ ...editData, value: +e.target.value })} /></TableCell>
                        <TableCell><Input className="h-8 text-xs" value={editData.display_mode} onChange={(e) => setEditData({ ...editData, display_mode: e.target.value })} /></TableCell>
                        <TableCell><Switch checked={editData.is_active} onCheckedChange={(v) => setEditData({ ...editData, is_active: v })} /></TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={saveEdit}><Save className="h-4 w-4 text-emerald-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell className="font-medium">{b.name_bn}</TableCell>
                        <TableCell>{b.name}</TableCell>
                        <TableCell>৳{b.value}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{b.display_mode}</TableCell>
                        <TableCell>
                          <Badge variant={b.is_active ? "default" : "secondary"} className="text-[10px] cursor-pointer" onClick={() => toggleActive(b.id, b.is_active)}>
                            {b.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-end">
                            <Button variant="ghost" size="icon" onClick={() => startEdit(b)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>নতুন অফার যোগ করুন</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">নাম (English)</Label><Input className="mt-1" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></div>
              <div><Label className="text-xs">নাম (বাংলা)</Label><Input className="mt-1" value={newItem.name_bn} onChange={(e) => setNewItem({ ...newItem, name_bn: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">মান (৳)</Label><Input type="number" className="mt-1" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: +e.target.value })} /></div>
              <div><Label className="text-xs">মোড</Label><Input className="mt-1" value={newItem.display_mode} onChange={(e) => setNewItem({ ...newItem, display_mode: e.target.value })} /></div>
            </div>
            <Button onClick={addItem} className="w-full"><Plus className="h-4 w-4 mr-1" /> যোগ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ===================== SETTINGS SECTION =====================
const SETTINGS_LABELS: Record<string, string> = {
  delivery_charge_inside_dhaka: "ঢাকায় ডেলিভারি চার্জ (৳)",
  delivery_charge_outside_dhaka: "ঢাকার বাইরে ডেলিভারি চার্জ (৳)",
  discount_amount: "ডিসকাউন্ট পরিমাণ (৳)",
  free_delivery_enabled: "ফ্রি ডেলিভারি সক্রিয়",
  honey_dipper_value: "হানি ডিপার মূল্য (৳)",
  stock_counter_number: "স্টক কাউন্টার সংখ্যা",
  whatsapp_number: "হোয়াটসঅ্যাপ নম্বর",
  contact_email: "যোগাযোগ ইমেইল",
  contact_phone: "যোগাযোগ ফোন",
};

const SettingsSection = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ key: "", value: "" });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("settings").select("*").order("key");
    setSettings(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const saveEdit = async (id: string) => {
    await supabase.from("settings").update({ value: editValue } as any).eq("id", id);
    toast({ title: "সেটিংস আপডেট হয়েছে" });
    setEditingId(null);
    fetchData();
  };

  const addItem = async () => {
    await supabase.from("settings").insert(newItem as any);
    toast({ title: "নতুন সেটিং যোগ হয়েছে" });
    setShowAdd(false);
    setNewItem({ key: "", value: "" });
    fetchData();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("এই সেটিং মুছে ফেলতে চান?")) return;
    await supabase.from("settings").delete().eq("id", id);
    toast({ title: "মুছে ফেলা হয়েছে" });
    fetchData();
  };

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  // Separate pricing/discount settings from others
  const pricingKeys = ["delivery_charge_inside_dhaka", "delivery_charge_outside_dhaka", "discount_amount", "free_delivery_enabled", "honey_dipper_value"];
  const pricingSettings = settings.filter(s => pricingKeys.includes(s.key));
  const otherSettings = settings.filter(s => !pricingKeys.includes(s.key));

  return (
    <>
      {/* Pricing & Discount Card */}
      <Card className="border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">💰 মূল্য, ডেলিভারি ও ডিসকাউন্ট</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricingSettings.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 bg-muted/50 rounded-lg p-3">
              <span className="text-sm font-medium">{SETTINGS_LABELS[s.key] || s.key}</span>
              <div className="flex items-center gap-2">
                {editingId === s.id ? (
                  <>
                    {s.key === "free_delivery_enabled" ? (
                      <select className="h-8 rounded-md border px-2 text-sm" value={editValue} onChange={(e) => setEditValue(e.target.value)}>
                        <option value="true">হ্যাঁ (সক্রিয়)</option>
                        <option value="false">না (নিষ্ক্রিয়)</option>
                      </select>
                    ) : (
                      <Input className="h-8 text-sm w-28" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                    )}
                    <Button variant="ghost" size="icon" onClick={() => saveEdit(s.id)}><Save className="h-4 w-4 text-emerald-600" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-bold text-primary">
                      {s.key === "free_delivery_enabled" ? (s.value === "true" ? "✅ সক্রিয়" : "❌ নিষ্ক্রিয়") : `৳${s.value}`}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(s.id); setEditValue(s.value); }}><Pencil className="h-4 w-4" /></Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Other Settings */}
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4 mr-1" /> নতুন সেটিং</Button>
      </div>
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কী</TableHead>
                  <TableHead>মান</TableHead>
                  <TableHead className="text-right">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherSettings.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">{SETTINGS_LABELS[s.key] || s.key}</TableCell>
                    <TableCell>
                      {editingId === s.id ? (
                        <Input className="h-8 text-xs" value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                      ) : (
                        <span className="text-sm">{s.value}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 justify-end">
                        {editingId === s.id ? (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => saveEdit(s.id)}><Save className="h-4 w-4 text-emerald-600" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => { setEditingId(s.id); setEditValue(s.value); }}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteItem(s.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>নতুন সেটিং</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">কী</Label><Input className="mt-1" value={newItem.key} onChange={(e) => setNewItem({ ...newItem, key: e.target.value })} /></div>
            <div><Label className="text-xs">মান</Label><Input className="mt-1" value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })} /></div>
            <Button onClick={addItem} className="w-full"><Plus className="h-4 w-4 mr-1" /> যোগ করুন</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
