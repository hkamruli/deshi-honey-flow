import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Download, Phone, MapPin, User, Package, Calendar, CreditCard } from "lucide-react";
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

const PAYMENT_LABELS: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি (COD)",
  mfs: "মোবাইল ব্যাংকিং (bKash/Nagad)",
  card: "কার্ড পেমেন্ট (Visa/Master)",
  bank: "ব্যাংক ট্রান্সফার",
};

const PAYMENT_LABELS_EN: Record<string, string> = {
  cod: "Cash on Delivery (COD)",
  mfs: "Mobile Banking (bKash/Nagad)",
  card: "Card Payment (Visa/Master)",
  bank: "Bank Transfer",
};

const generateInvoiceHTML = (order: OrderRow) => {
  const paymentLabel = PAYMENT_LABELS[order.payment_method || "cod"] || "ক্যাশ অন ডেলিভারি (COD)";
  const paymentLabelEn = PAYMENT_LABELS_EN[order.payment_method || "cod"] || "Cash on Delivery (COD)";
  
  return `
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Invoice - ${order.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Noto Sans Bengali', 'Segoe UI', sans-serif; padding: 32px; color: #1a1a1a; max-width: 800px; margin: auto; background: #fff; }
  
  .invoice-container { border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
  
  .header { background: linear-gradient(135deg, #92400e 0%, #b45309 50%, #d97706 100%); color: white; padding: 28px 32px; display: flex; justify-content: space-between; align-items: center; }
  .brand-section { display: flex; align-items: center; gap: 16px; }
  .brand-logo { width: 56px; height: 56px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); object-fit: cover; }
  .brand-name { font-size: 22px; font-weight: 700; }
  .brand-name small { display: block; font-size: 11px; font-weight: 400; opacity: 0.8; letter-spacing: 1px; }
  .invoice-meta { text-align: right; }
  .invoice-meta h2 { font-size: 24px; font-weight: 800; letter-spacing: 2px; opacity: 0.9; }
  .invoice-meta p { font-size: 13px; opacity: 0.8; margin-top: 4px; }
  
  .body-content { padding: 28px 32px; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
  .info-box { background: #fffbeb; padding: 16px; border-radius: 10px; border-left: 4px solid #f59e0b; }
  .info-box h4 { font-size: 11px; color: #92400e; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
  .info-box p { font-size: 13px; line-height: 1.8; color: #374151; }
  .info-box strong { color: #1a1a1a; }
  
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; border-radius: 10px; overflow: hidden; }
  th { background: #1f2937; color: white; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  td { padding: 12px 16px; border-bottom: 1px solid #f3f4f6; font-size: 14px; color: #374151; }
  tr:last-child td { border-bottom: none; }
  .total-row { background: linear-gradient(135deg, #fffbeb, #fef3c7); }
  .total-row td { font-weight: 700; font-size: 18px; color: #92400e; border-top: 2px solid #f59e0b; padding: 16px; }
  
  .payment-badge { display: inline-block; background: #ecfdf5; color: #065f46; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; border: 1px solid #a7f3d0; margin-bottom: 20px; }
  
  .footer { background: #f9fafb; padding: 20px 32px; border-top: 1px solid #e5e7eb; text-align: center; }
  .footer p { font-size: 11px; color: #9ca3af; line-height: 1.8; }
  .footer .highlight { color: #b45309; font-weight: 600; }
  
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 80px; opacity: 0.03; font-weight: 900; color: #b45309; pointer-events: none; }
  
  @media print { 
    body { padding: 0; } 
    .no-print { display: none !important; } 
    .invoice-container { border: none; }
  }
</style>
</head><body>
  <div class="watermark">INVOICE</div>
  <div class="invoice-container">
    <div class="header">
      <div class="brand-section">
        <div>
          <div class="brand-name">🍯 Fresh Foods<small>Natural Honey — Eat Natural</small></div>
        </div>
      </div>
      <div class="invoice-meta">
        <h2>INVOICE</h2>
        <p>#${order.order_number}</p>
        <p>${new Date(order.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>
    </div>
    
    <div class="body-content">
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
        <thead>
          <tr>
            <th>পণ্য</th>
            <th style="text-align:center">পরিমাণ</th>
            <th style="text-align:right">একক মূল্য</th>
            <th style="text-align:right">মোট</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>🍯 Natural Honey</td>
            <td style="text-align:center">${order.quantity}</td>
            <td style="text-align:right">৳${order.unit_price?.toLocaleString() || "—"}</td>
            <td style="text-align:right">৳${((order.unit_price || 0) * order.quantity).toLocaleString()}</td>
          </tr>
          <tr>
            <td colspan="3" style="text-align:right; color: #6b7280;">ডেলিভারি চার্জ</td>
            <td style="text-align:right">৳${order.delivery_charge.toLocaleString()}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align:right">সর্বমোট</td>
            <td style="text-align:right">৳${order.total_amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      
      <div style="text-align:center">
        <div class="payment-badge">💰 পেমেন্ট: ${paymentLabel}</div>
      </div>
    </div>
    
    <div class="footer">
      <p class="highlight">Fresh Foods — Natural Honey | Eat Natural</p>
      <p>📍 Feni, Bangladesh | 📞 ০১৮৬৮৩৭১৬৭৪ | 📧 info@deshifoods.com</p>
      <p>ধন্যবাদ আপনার অর্ডারের জন্য!</p>
    </div>
  </div>
</body></html>`;
};

const OrderDetailModal = ({ order, open, onClose, onStatusChange }: Props) => {
  if (!order) return null;

  const paymentLabel = PAYMENT_LABELS[order.payment_method || "cod"] || "ক্যাশ অন ডেলিভারি (COD)";

  const handlePrintInvoice = () => {
    const html = generateInvoiceHTML(order);
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => { printWindow.print(); }, 500);
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

  const handleUpdatePayment = async (newMethod: string) => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.from("orders").update({ payment_method: newMethod } as any).eq("id", order.id);
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
          </div>

          {/* Payment Method */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5"><CreditCard className="h-4 w-4" /> পেমেন্ট পদ্ধতি</h4>
            <select
              value={order.payment_method || "cod"}
              onChange={(e) => handleUpdatePayment(e.target.value)}
              className="text-sm rounded-md border px-3 py-1.5 w-full bg-background"
            >
              <option value="cod">💵 ক্যাশ অন ডেলিভারি (COD)</option>
              <option value="mfs">📱 মোবাইল ব্যাংকিং (bKash/Nagad)</option>
              <option value="card">💳 কার্ড পেমেন্ট (Visa/Master)</option>
              <option value="bank">🏦 ব্যাংক ট্রান্সফার</option>
            </select>
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
