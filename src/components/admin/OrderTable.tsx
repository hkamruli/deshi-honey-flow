import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Eye, Search } from "lucide-react";

export interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  full_address: string;
  status: string;
  total_amount: number;
  quantity: number;
  delivery_charge: number;
  unit_price: number;
  created_at: string;
  product_variation_id: string;
  district_id: string | null;
  area: string | null;
  email: string | null;
}

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  processing: "bg-purple-100 text-purple-800 border-purple-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

interface Props {
  orders: OrderRow[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => void;
  onViewOrder: (order: OrderRow) => void;
}

const OrderTable = ({ orders, loading, onStatusChange, onViewOrder }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) =>
    !search ||
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.phone.includes(search) ||
    o.order_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <CardTitle className="text-lg">অর্ডার তালিকা ({filtered.length})</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম, ফোন বা অর্ডার নং..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-muted/50"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted/50 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">কোনো অর্ডার পাওয়া যায়নি</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[120px]">অর্ডার নং</TableHead>
                  <TableHead>নাম</TableHead>
                  <TableHead>ফোন</TableHead>
                  <TableHead className="text-right">মোট</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead className="w-[60px]">অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => (
                  <TableRow key={order.id} className="group cursor-pointer" onClick={() => onViewOrder(order)}>
                    <TableCell className="font-mono text-xs">{order.order_number}</TableCell>
                    <TableCell className="font-medium">{order.customer_name}</TableCell>
                    <TableCell>
                      <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>{order.phone}</a>
                    </TableCell>
                    <TableCell className="text-right font-bold">৳{order.total_amount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => onStatusChange(order.id, e.target.value)}
                        className={`text-xs rounded-full px-2.5 py-1 border font-medium cursor-pointer ${STATUS_STYLES[order.status] || ""}`}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => onViewOrder(order)} title="বিস্তারিত দেখুন" className="opacity-50 group-hover:opacity-100 transition-opacity">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { STATUS_OPTIONS };
export default OrderTable;
