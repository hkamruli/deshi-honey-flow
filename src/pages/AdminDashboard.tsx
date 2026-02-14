import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStats from "@/components/admin/AdminStats";
import OrderTable, { STATUS_OPTIONS, type OrderRow } from "@/components/admin/OrderTable";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import AbandonedCarts from "@/components/admin/AbandonedCarts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [abandonedCount, setAbandonedCount] = useState(0);
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

    const [{ data: periodOrders }, { data: abandoned }, { data: recent }] = await Promise.all([
      supabase.from("orders").select("total_amount, delivery_charge, status").gte("created_at", since),
      supabase.from("abandoned_carts").select("id").eq("is_converted", false),
      supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
    ]);

    const allOrders = periodOrders || [];
    const revenue = allOrders.reduce((s: number, o: any) => s + o.total_amount, 0);
    const deliveryRevenue = allOrders.reduce((s: number, o: any) => s + (o.delivery_charge || 0), 0);
    const totalOrders = allOrders.length;
    const pending = allOrders.filter((o: any) => o.status === "pending").length;
    const confirmed = allOrders.filter((o: any) => o.status === "confirmed").length;
    const processing = allOrders.filter((o: any) => o.status === "processing").length;
    const shipped = allOrders.filter((o: any) => o.status === "shipped").length;
    const delivered = allOrders.filter((o: any) => o.status === "delivered").length;
    const cancelled = allOrders.filter((o: any) => o.status === "cancelled").length;

    setAbandonedCount(abandoned?.length || 0);
    setRecentOrders((recent as any[]) || []);
    setAnalytics({
      totalOrders,
      revenue,
      deliveryRevenue,
      conversionRate: "0",
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      visitorCount: 0,
      uncompleted: 0,
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

            {/* Recent Orders */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  📋 সাম্প্রতিক অর্ডার
                </CardTitle>
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
                          <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                            <TableCell className="font-medium">{order.customer_name}</TableCell>
                            <TableCell className="text-sm">{order.quantity}x</TableCell>
                            <TableCell>
                              <Badge className={`${STATUS_STYLES[order.status] || ""} border-0 text-[10px]`}>
                                {order.status}
                              </Badge>
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
                <Button
                  key={f.key}
                  size="sm"
                  variant={filter === f.key ? "default" : "outline"}
                  onClick={() => setFilter(f.key)}
                  className="capitalize rounded-full"
                >
                  {f.label}
                </Button>
              ))}
            </div>
            <OrderTable
              orders={orders}
              loading={loading}
              onStatusChange={updateStatus}
              onViewOrder={setSelectedOrder}
            />
          </div>
        );

      case "products":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">প্রোডাক্ট ম্যানেজমেন্ট</h2>
            <ProductsSection />
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">টেস্টিমোনিয়াল</h2>
            <TestimonialsSection />
          </div>
        );

      case "offers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">অফার ও বোনাস</h2>
            <OffersSection />
          </div>
        );

      case "abandoned":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">অসম্পূর্ণ অর্ডার</h2>
            <AbandonedCarts />
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">সেটিংস</h2>
            <SettingsSection />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2 ml-10 md:ml-0">
              <span className="text-lg">📊</span>
              <h1 className="text-base font-bold">আডমিন প্যানেল</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { fetchOrders(); fetchAnalytics(); }}
              className="text-muted-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {renderContent()}
        </div>

        <OrderDetailModal
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateStatus}
        />
      </main>
    </div>
  );
};

// ---- Sub-sections for sidebar pages ----

const ProductsSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("product_variations").select("*").order("sort_order").then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>সাইজ</TableHead>
              <TableHead className="text-right">মূল্য</TableHead>
              <TableHead className="text-right">আসল মূল্য</TableHead>
              <TableHead>ব্যাজ</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name_bn}</TableCell>
                <TableCell>{p.size_bn}</TableCell>
                <TableCell className="text-right font-bold">৳{p.price}</TableCell>
                <TableCell className="text-right text-muted-foreground">{p.original_price ? `৳${p.original_price}` : "—"}</TableCell>
                <TableCell>{p.badge_bn || "—"}</TableCell>
                <TableCell>
                  <Badge variant={p.is_active ? "default" : "secondary"} className="text-[10px]">
                    {p.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("testimonials").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setTestimonials(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>জেলা</TableHead>
              <TableHead>রিভিউ</TableHead>
              <TableHead>রেটিং</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell>{t.district}</TableCell>
                <TableCell className="max-w-[200px] truncate text-sm">{t.review_text}</TableCell>
                <TableCell>{"⭐".repeat(t.rating)}</TableCell>
                <TableCell>
                  <Badge variant={t.is_active ? "default" : "secondary"} className="text-[10px]">
                    {t.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const OffersSection = () => {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("bonuses").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setBonuses(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>নাম</TableHead>
              <TableHead>মান</TableHead>
              <TableHead>মোড</TableHead>
              <TableHead>স্ট্যাটাস</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bonuses.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.name_bn}</TableCell>
                <TableCell>৳{b.value}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{b.display_mode}</TableCell>
                <TableCell>
                  <Badge variant={b.is_active ? "default" : "secondary"} className="text-[10px]">
                    {b.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const SettingsSection = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("settings").select("*").order("key").then(({ data }) => {
      setSettings(data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="h-40 bg-muted/50 rounded-xl animate-pulse" />;

  return (
    <Card className="border-border/50">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>কী</TableHead>
              <TableHead>মান</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-xs">{s.key}</TableCell>
                <TableCell className="text-sm">{s.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
