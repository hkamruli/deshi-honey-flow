import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw, LayoutDashboard, ShoppingCart, AlertTriangle } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import OrderTable, { STATUS_OPTIONS, type OrderRow } from "@/components/admin/OrderTable";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import AbandonedCarts from "@/components/admin/AbandonedCarts";

type FilterMode = "all" | "uncompleted" | (typeof STATUS_OPTIONS)[number];
type TabMode = "orders" | "abandoned";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [activeTab, setActiveTab] = useState<TabMode>("orders");
  const [abandonedCount, setAbandonedCount] = useState(0);

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
    const today = new Date().toISOString().split("T")[0];
    const [{ data: todayOrders }, { data: allActive }, { data: visitors }, { data: abandoned }] = await Promise.all([
      supabase.from("orders").select("total_amount, status").gte("created_at", today),
      supabase.from("orders").select("id, status").not("status", "in", '("delivered","cancelled")'),
      supabase.from("visitor_analytics").select("id").gte("created_at", today).eq("event_type", "page_view"),
      supabase.from("abandoned_carts").select("id").eq("is_converted", false),
    ]);
    const totalOrders = todayOrders?.length || 0;
    const revenue = todayOrders?.reduce((s: number, o: any) => s + o.total_amount, 0) || 0;
    const visitorCount = visitors?.length || 0;
    const conversionRate = visitorCount > 0 ? ((totalOrders / visitorCount) * 100).toFixed(1) : "0";
    const pending = todayOrders?.filter((o: any) => o.status === "pending").length || 0;
    const uncompleted = allActive?.length || 0;
    setAbandonedCount(abandoned?.length || 0);
    setAnalytics({ totalOrders, revenue, conversionRate, pending, visitorCount, uncompleted });
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filterButtons: { key: FilterMode; label: string }[] = [
    { key: "all", label: "সব" },
    { key: "uncompleted", label: "🔴 অসম্পন্ন" },
    ...STATUS_OPTIONS.map((s) => ({ key: s as FilterMode, label: s })),
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍯</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">দেশি ফুডস</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">অ্যাডমিন প্যানেল</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => { fetchOrders(); fetchAnalytics(); }} className="text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">
        {/* Stats */}
        <AdminStats analytics={analytics} />

        {/* Tab navigation */}
        <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "orders"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            অর্ডার ম্যানেজমেন্ট
          </button>
          <button
            onClick={() => setActiveTab("abandoned")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
              activeTab === "abandoned"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            অসম্পূর্ণ অর্ডার
            {abandonedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {abandonedCount > 99 ? "99+" : abandonedCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "orders" ? (
          <>
            {/* Filters */}
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
          </>
        ) : (
          <AbandonedCarts />
        )}

        <OrderDetailModal
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateStatus}
        />
      </div>
    </main>
  );
};

export default AdminDashboard;
