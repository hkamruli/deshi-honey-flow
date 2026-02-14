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
  mfs: "মোবাইল ব্যাংকিং (নগদ/বিকাশ/রকেট)",
};

const PAYMENT_LABELS_EN: Record<string, string> = {
  cod: "Cash on Delivery (COD)",
  mfs: "Mobile Banking (Nagad/bKash/Rocket)",
};

const STATUS_LABELS_EN: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const generateInvoiceHTML = (order: OrderRow) => {
  const paymentLabel = PAYMENT_LABELS[order.payment_method || "cod"] || "ক্যাশ অন ডেলিভারি (COD)";
  const paymentLabelEn = PAYMENT_LABELS_EN[order.payment_method || "cod"] || "Cash on Delivery (COD)";
  const statusEn = STATUS_LABELS_EN[order.status] || order.status;
  
  return `
<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>Invoice - ${order.order_number}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;600;700;800&display=swap');
  body { font-family: 'Noto Sans Bengali', 'Segoe UI', sans-serif; padding: 24px; color: #1a1a1a; max-width: 800px; margin: auto; background: #fff; }
  
  .invoice-container { border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  
  /* Premium Header */
  .header { 
    background: linear-gradient(135deg, #78350f 0%, #92400e 30%, #b45309 60%, #d97706 100%); 
    color: white; 
    padding: 24px 32px; 
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    position: relative;
    overflow: hidden;
  }
  .header::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
  }
  .brand-section { display: flex; align-items: center; gap: 14px; z-index: 1; }
  .brand-logo { 
    width: 52px; height: 52px; border-radius: 50%; 
    border: 2px solid rgba(255,255,255,0.35); 
    object-fit: cover; 
    box-shadow: 0 2px 12px rgba(0,0,0,0.2);
  }
  .brand-info {}
  .brand-name { font-size: 20px; font-weight: 800; letter-spacing: -0.3px; }
  .brand-tagline { font-size: 10px; opacity: 0.7; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
  
  .invoice-meta { text-align: right; z-index: 1; }
  .invoice-label { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 2px; }
  .invoice-number { font-size: 14px; font-weight: 700; margin-top: 4px; }
  .invoice-date { font-size: 12px; opacity: 0.8; margin-top: 2px; }
  .invoice-status { 
    display: inline-block; 
    background: rgba(255,255,255,0.2); 
    padding: 3px 10px; 
    border-radius: 20px; 
    font-size: 10px; 
    font-weight: 600; 
    margin-top: 6px; 
    text-transform: uppercase; 
    letter-spacing: 0.5px;
    backdrop-filter: blur(4px);
  }
  
  .body-content { padding: 28px 32px; }
  
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .info-box { 
    background: linear-gradient(135deg, #fffbeb, #fef9f0); 
    padding: 16px; 
    border-radius: 12px; 
    border: 1px solid #fde68a;
  }
  .info-box h4 { 
    font-size: 10px; 
    color: #92400e; 
    margin-bottom: 10px; 
    text-transform: uppercase; 
    letter-spacing: 1.5px; 
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .info-box p { font-size: 13px; line-height: 1.9; color: #374151; }
  .info-box strong { color: #1a1a1a; font-weight: 700; }
  
  /* Table */
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; }
  th { background: #1f2937; color: white; text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600; }
  td { padding: 12px 16px; font-size: 13px; color: #374151; }
  tr:nth-child(even) td { background: #f9fafb; }
  .subtotal-row td { border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  .total-row { background: linear-gradient(135deg, #fffbeb, #fef3c7) !important; }
  .total-row td { font-weight: 800; font-size: 16px; color: #92400e; border-top: 2px solid #f59e0b; padding: 14px 16px; }
  
  /* Payment badge */
  .payment-section { 
    display: flex; 
    justify-content: center; 
    gap: 12px; 
    margin: 20px 0;
  }
  .payment-badge { 
    display: inline-flex; 
    align-items: center; 
    gap: 8px;
    background: linear-gradient(135deg, #ecfdf5, #d1fae5); 
    color: #065f46; 
    padding: 10px 20px; 
    border-radius: 10px; 
    font-size: 13px; 
    font-weight: 600; 
    border: 1px solid #a7f3d0;
  }
  
  /* Footer */
  .footer { 
    background: linear-gradient(135deg, #f8fafc, #f1f5f9); 
    padding: 20px 32px; 
    border-top: 1px solid #e2e8f0; 
    text-align: center; 
  }
  .footer-brand { font-size: 13px; font-weight: 700; color: #92400e; margin-bottom: 4px; }
  .footer p { font-size: 11px; color: #94a3b8; line-height: 1.8; }
  
  .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 90px; opacity: 0.025; font-weight: 900; color: #b45309; pointer-events: none; letter-spacing: 10px; }
  
  @media print { 
    body { padding: 0; } 
    .no-print { display: none !important; } 
    .invoice-container { border: none; box-shadow: none; }
  }
</style>
</head><body>
  <div class="watermark">INVOICE</div>
  <div class="invoice-container">
    <div class="header">
      <div class="brand-section">
        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MiIgaGVpZ2h0PSI1MiIgdmlld0JveD0iMCAwIDUyIDUyIj48Y2lyY2xlIGN4PSIyNiIgY3k9IjI2IiByPSIyNiIgZmlsbD0iI2Y1OWUwYiIvPjx0ZXh0IHg9IjI2IiB5PSIzNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIj7wn42vPC90ZXh0Pjwvc3ZnPg==" alt="Logo" class="brand-logo" />
        <div class="brand-info">
          <div class="brand-name">Fresh Foods</div>
          <div class="brand-tagline">Natural Honey — Eat Natural</div>
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-label">Invoice</div>
        <div class="invoice-number">#${order.order_number}</div>
        <div class="invoice-date">${new Date(order.created_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })}</div>
        <div class="invoice-status">${statusEn}</div>
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
            <td>🍯 Fresh Foods Natural Honey</td>
            <td style="text-align:center">${order.quantity}</td>
            <td style="text-align:right">৳${order.unit_price?.toLocaleString() || "—"}</td>
            <td style="text-align:right">৳${((order.unit_price || 0) * order.quantity).toLocaleString()}</td>
          </tr>
          <tr class="subtotal-row">
            <td colspan="3" style="text-align:right">ডেলিভারি চার্জ</td>
            <td style="text-align:right">৳${order.delivery_charge.toLocaleString()}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" style="text-align:right">সর্বমোট</td>
            <td style="text-align:right">৳${order.total_amount.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="payment-section">
        <div class="payment-badge">💰 পেমেন্ট: ${paymentLabel}</div>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-brand">🍯 Fresh Foods — Natural Honey | Eat Natural</p>
      <p>📍 Feni, Bangladesh | 📞 ০১৮৬৮৩৭১৬৭৪ | 📧 info@freshfoods.com</p>
      <p style="margin-top: 8px; font-size: 10px; color: #cbd5e1;">ধন্যবাদ আপনার অর্ডারের জন্য! — Thank you for your order!</p>
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
              <option value="mfs">📱 মোবাইল ব্যাংকিং (নগদ/বিকাশ/রকেট)</option>
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
