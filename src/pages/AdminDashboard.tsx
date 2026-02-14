import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, DollarSign, TrendingUp, Package, LogOut, RefreshCw } from "lucide-react";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  full_address: string;
  status: string;
  total_amount: number;
  quantity: number;
  delivery_charge: number;
  created_at: string;
  product_variation_id: string;
  district_id: string | null;
}

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const statusColors: Record<string, string> = {
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchOrders = async () => {
    setLoading(true);
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (statusFilter !== "all") query = query.eq("status", statusFilter);
    const { data } = await query;
    setOrders((data as any[]) || []);
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data: todayOrders } = await supabase
      .from("orders")
      .select("total_amount, status")
      .gte("created_at", today);

    const { data: visitors } = await supabase
      .from("visitor_analytics")
      .select("id")
      .gte("created_at", today)
      .eq("event_type", "page_view");

    const totalOrders = todayOrders?.length || 0;
    const revenue = todayOrders?.reduce((s: number, o: any) => s + o.total_amount, 0) || 0;
    const visitorCount = visitors?.length || 0;
    const conversionRate = visitorCount > 0 ? ((totalOrders / visitorCount) * 100).toFixed(1) : "0";
    const pending = todayOrders?.filter((o: any) => o.status === "pending").length || 0;

    setAnalytics({ totalOrders, revenue, conversionRate, pending, visitorCount });
  };

  useEffect(() => {
    // Check auth
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

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from("orders").update({ status: newStatus } as any).eq("id", id);
    fetchOrders();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🍯 দেশি ফুডস — অ্যাডমিন</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { fetchOrders(); fetchAnalytics(); }}>
              <RefreshCw className="h-4 w-4 mr-1" /> রিফ্রেশ
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> লগআউট
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.totalOrders}</p>
                    <p className="text-xs text-muted-foreground">আজকের অর্ডার</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">৳{analytics.revenue}</p>
                    <p className="text-xs text-muted-foreground">আজকের রেভিনিউ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                    <p className="text-xs text-muted-foreground">কনভার্সন রেট</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-urgency/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-urgency" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{analytics.pending}</p>
                    <p className="text-xs text-muted-foreground">পেন্ডিং অর্ডার</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap mb-4">
          <Button size="sm" variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>সব</Button>
          {statusOptions.map((s) => (
            <Button key={s} size="sm" variant={statusFilter === s ? "default" : "outline"} onClick={() => setStatusFilter(s)} className="capitalize">{s}</Button>
          ))}
        </div>

        {/* Orders table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">অর্ডার তালিকা ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">লোড হচ্ছে...</p>
            ) : orders.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">অর্ডার নং</th>
                    <th className="text-left py-2 px-2">নাম</th>
                    <th className="text-left py-2 px-2">ফোন</th>
                    <th className="text-left py-2 px-2">মোট</th>
                    <th className="text-left py-2 px-2">তারিখ</th>
                    <th className="text-left py-2 px-2">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-mono text-xs">{order.order_number}</td>
                      <td className="py-2 px-2">{order.customer_name}</td>
                      <td className="py-2 px-2">{order.phone}</td>
                      <td className="py-2 px-2 font-bold">৳{order.total_amount}</td>
                      <td className="py-2 px-2 text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-xs rounded-full px-2 py-1 border-0 font-medium ${statusColors[order.status] || ""}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AdminDashboard;
