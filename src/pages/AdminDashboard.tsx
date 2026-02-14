import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, RefreshCw } from "lucide-react";
import AdminStats from "@/components/admin/AdminStats";
import OrderTable, { STATUS_OPTIONS, type OrderRow } from "@/components/admin/OrderTable";
import OrderDetailModal from "@/components/admin/OrderDetailModal";

type FilterMode = "all" | "uncompleted" | (typeof STATUS_OPTIONS)[number];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>("all");
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

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
    const [{ data: todayOrders }, { data: allActive }, { data: visitors }] = await Promise.all([
      supabase.from("orders").select("total_amount, status").gte("created_at", today),
      supabase.from("orders").select("id, status").not("status", "in", '("delivered","cancelled")'),
      supabase.from("visitor_analytics").select("id").gte("created_at", today).eq("event_type", "page_view"),
    ]);
    const totalOrders = todayOrders?.length || 0;
    const revenue = todayOrders?.reduce((s: number, o: any) => s + o.total_amount, 0) || 0;
    const visitorCount = visitors?.length || 0;
    const conversionRate = visitorCount > 0 ? ((totalOrders / visitorCount) * 100).toFixed(1) : "0";
    const pending = todayOrders?.filter((o: any) => o.status === "pending").length || 0;
    const uncompleted = allActive?.length || 0;
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
    // Update selected order in modal if open
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
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Stats */}
        <AdminStats analytics={analytics} />

        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          {filterButtons.map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "outline"}
              onClick={() => setFilter(f.key)}
              className="capitalize"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={orders}
          loading={loading}
          onStatusChange={updateStatus}
          onViewOrder={setSelectedOrder}
        />

        {/* Order Detail Modal */}
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
