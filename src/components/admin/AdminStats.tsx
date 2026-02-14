import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, DollarSign, TrendingUp, Package, Users, AlertCircle } from "lucide-react";

interface Analytics {
  totalOrders: number;
  revenue: number;
  conversionRate: string;
  pending: number;
  visitorCount: number;
  uncompleted: number;
}

const AdminStats = ({ analytics }: { analytics: Analytics | null }) => {
  if (!analytics) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardContent className="p-4">
              <div className="h-4 w-20 bg-muted rounded animate-pulse mb-2" />
              <div className="h-7 w-16 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    { icon: ShoppingCart, label: "আজকের অর্ডার", value: analytics.totalOrders, bg: "bg-primary/10", color: "text-primary" },
    { icon: DollarSign, label: "আজকের রেভিনিউ", value: `৳${analytics.revenue.toLocaleString()}`, bg: "bg-secondary/10", color: "text-secondary" },
    { icon: AlertCircle, label: "অসম্পন্ন অর্ডার", value: analytics.uncompleted, bg: "bg-destructive/10", color: "text-destructive" },
    { icon: Package, label: "পেন্ডিং অর্ডার", value: analytics.pending, bg: "bg-primary/10", color: "text-primary" },
    { icon: Users, label: "আজকের ভিজিটর", value: analytics.visitorCount, bg: "bg-blue-500/10", color: "text-blue-600" },
    { icon: TrendingUp, label: "কনভার্সন রেট", value: `${analytics.conversionRate}%`, bg: "bg-purple-500/10", color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((s) => (
        <Card key={s.label} className="border-border/50 hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
