import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Phone, MapPin, User, Package, Calendar } from "lucide-react";
import type { OrderRow } from "./OrderTable";

interface Props {
  order: OrderRow | null;
  open: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const generateInvoiceHTML = (order: OrderRow) => `
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Invoice - ${order.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Noto Sans Bengali', 'Segoe UI', sans-serif; padding: 24px; color: #1a1a1a; max-width: 800px; margin: auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #f59e0b; padding-bottom: 16px; margin-bottom: 20px; }
  .brand { font-size: 24px; font-weight: 700; color: #b45309; }
  .brand small { display: block; font-size: 12px; color: #666; font-weight: 400; }
  .invoice-title { text-align: right; }
  .invoice-title h2 { font-size: 20px; color: #333; }
  .invoice-title p { font-size: 13px; color: #666; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .info-box { background: #fefce8; padding: 14px; border-radius: 8px; }
  .info-box h4 { font-size: 13px; color: #92400e; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-box p { font-size: 14px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  th { background: #fef3c7; text-align: left; padding: 10px 12px; font-size: 13px; color: #92400e; border-bottom: 2px solid #f59e0b; }
  td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
  .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #f59e0b; background: #fffbeb; }
  .footer { text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #999; font-size: 12px; }
  @media print { body { padding: 0; } .no-print { display: none !important; } }
</style>
</head><body>
  <div class="header">
    <div class="brand">🍯 দেশি ফুডস<small>Natural Honey - Organic Product</small></div>
    <div class="invoice-title">
      <h2>ইনভয়েস</h2>
      <p>${order.order_number}</p>
      <p>${new Date(order.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
    </div>
  </div>
  <div class="info-grid">
    <div class="info-box">
      <h4>👤 কাস্টমার তথ্য</h4>
      <p><strong>${order.customer_name}</strong></p>
      <p>📞 ${order.phone}</p>
      ${order.email ? `<p>📧 ${order.email}</p>` : ""}
    </div>
    <div class="info-box">
      <h4>📍 ডেলিভারি ঠিকানা</h4>
      <p>${order.full_address}</p>
      ${order.area ? `<p>এলাকা: ${order.area}</p>` : ""}
    </div>
  </div>
  <table>
    <thead><tr><th>পণ্য</th><th style="text-align:center">পরিমাণ</th><th style="text-align:right">একক মূল্য</th><th style="text-align:right">মোট</th></tr></thead>
    <tbody>
      <tr>
        <td>🍯 Natural Honey</td>
        <td style="text-align:center">${order.quantity}</td>
        <td style="text-align:right">৳${order.unit_price?.toLocaleString() || "—"}</td>
        <td style="text-align:right">৳${((order.unit_price || 0) * order.quantity).toLocaleString()}</td>
      </tr>
      <tr>
        <td colspan="3" style="text-align:right">ডেলিভারি চার্জ</td>
        <td style="text-align:right">৳${order.delivery_charge.toLocaleString()}</td>
      </tr>
      <tr class="total-row">
        <td colspan="3" style="text-align:right">সর্বমোট</td>
        <td style="text-align:right">৳${order.total_amount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>
  <p style="text-align:center; font-size:13px; color:#666; margin-bottom:8px;">💵 পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (COD)</p>
  <div class="footer">
    <p>ধন্যবাদ আপনার অর্ডারের জন্য! | যোগাযোগ: ০১৮৬৮৩৭১৬৭৪</p>
  </div>
</body></html>`;

const OrderDetailModal = ({ order, open, onClose, onStatusChange }: Props) => {
  if (!order) return null;

  const handlePrintInvoice = () => {
    const html = generateInvoiceHTML(order);
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Try to print automatically; if printer not available, user can save as PDF
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const handleDownloadPDF = () => {
    const html = generateInvoiceHTML(order);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.order_number}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>অর্ডার #{order.order_number}</span>
            <Badge className={`${STATUS_COLORS[order.status]} border-0 text-xs`}>{order.status}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><User className="h-4 w-4" /> কাস্টমার তথ্য</h4>
            <p className="text-sm font-medium">{order.customer_name}</p>
            <p className="text-sm flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              <a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">{order.phone}</a>
            </p>
            <p className="text-sm flex items-start gap-1.5">
              <MapPin className="h-3.5 w-3.5 mt-0.5" />
              <span>{order.full_address}{order.area ? `, ${order.area}` : ""}</span>
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><Package className="h-4 w-4" /> অর্ডার বিবরণ</h4>
            <div className="flex justify-between text-sm">
              <span>🍯 Natural Honey × {order.quantity}</span>
              <span>৳{((order.unit_price || 0) * order.quantity).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>ডেলিভারি চার্জ</span>
              <span>৳{order.delivery_charge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm font-bold border-t pt-2">
              <span>সর্বমোট</span>
              <span>৳{order.total_amount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted-foreground">💵 পেমেন্ট: ক্যাশ অন ডেলিভারি (COD)</p>
          </div>

          {/* Timestamps */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><Calendar className="h-4 w-4" /> টাইমলাইন</h4>
            <p className="text-xs text-muted-foreground">
              📅 অর্ডার: {new Date(order.created_at).toLocaleString("bn-BD")}
            </p>
          </div>

          {/* Status Update */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">স্ট্যাটাস আপডেট:</label>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="text-sm rounded-md border px-3 py-1.5 flex-1"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Invoice Actions */}
          <div className="flex gap-2">
            <Button onClick={handlePrintInvoice} className="flex-1" variant="default">
              <Printer className="h-4 w-4 mr-1.5" /> প্রিন্ট ইনভয়েস
            </Button>
            <Button onClick={handleDownloadPDF} className="flex-1" variant="outline">
              <Download className="h-4 w-4 mr-1.5" /> ডাউনলোড
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
