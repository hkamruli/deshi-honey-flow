import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Truck,
  ShoppingCart,
  Clock,
  CheckCircle2,
  Package,
  CircleCheck,
  XCircle,
} from "lucide-react";

interface Analytics {
  totalOrders: number;
  revenue: number;
  deliveryRevenue: number;
  conversionRate: string;
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  visitorCount: number;
  uncompleted: number;
}

const AdminStats = ({ analytics }: { analytics: Analytics | null }) => {
  if (!analytics) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted/50 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statusCards = [
    { icon: ShoppingCart, label: "মোট অর্ডার", value: analytics.totalOrders, iconColor: "text-foreground" },
    { icon: Clock, label: "পেন্ডিং", value: analytics.pending, iconColor: "text-amber-500" },
    { icon: CheckCircle2, label: "কনফার্মড", value: analytics.confirmed, iconColor: "text-emerald-500" },
    { icon: Package, label: "শিপড", value: analytics.shipped, iconColor: "text-blue-500" },
    { icon: CircleCheck, label: "ডেলিভারড", value: analytics.delivered, iconColor: "text-emerald-600" },
    { icon: XCircle, label: "ক্যান্সেলড", value: analytics.cancelled, iconColor: "text-destructive" },
  ];

  return (
    <div className="space-y-4">
      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Revenue */}
        <Card className="border-0 bg-red-50 dark:bg-red-950/30 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">মোট রেভিনিউ</p>
              <p className="text-3xl font-extrabold text-destructive mt-1">
                ৳{analytics.revenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Revenue */}
        <Card className="border-0 bg-emerald-50 dark:bg-emerald-950/30 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">ডেলিভারি রেভিনিউ</p>
              <p className="text-3xl font-extrabold text-emerald-600 mt-1">
                ৳{analytics.deliveryRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <Truck className="h-6 w-6 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statusCards.map((s) => (
          <Card key={s.label} className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold mt-0.5">{s.value}</p>
              </div>
              <s.icon className={`h-5 w-5 ${s.iconColor} opacity-60`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminStats;
