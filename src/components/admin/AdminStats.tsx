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
  if (!analytics) return null;

  const stats = [
    { icon: ShoppingCart, label: "আজকের অর্ডার", value: analytics.totalOrders, color: "text-primary" },
    { icon: DollarSign, label: "আজকের রেভিনিউ", value: `৳${analytics.revenue.toLocaleString()}`, color: "text-emerald-600" },
    { icon: AlertCircle, label: "অসম্পন্ন অর্ডার", value: analytics.uncompleted, color: "text-orange-600" },
    { icon: Package, label: "পেন্ডিং অর্ডার", value: analytics.pending, color: "text-yellow-600" },
    { icon: Users, label: "আজকের ভিজিটর", value: analytics.visitorCount, color: "text-blue-600" },
    { icon: TrendingUp, label: "কনভার্সন রেট", value: `${analytics.conversionRate}%`, color: "text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <p className="text-xs text-muted-foreground truncate">{s.label}</p>
            </div>
            <p className="text-xl font-bold">{s.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStats;
