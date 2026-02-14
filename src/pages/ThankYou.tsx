import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle, ArrowLeft, Package, Truck, Phone, PartyPopper, Mail, PhoneCall } from "lucide-react";
import { useSettings } from "@/hooks/useData";
import honeySplash from "@/assets/honey-splash.png";

interface OrderState {
  name: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  total: number;
  deliveryCharge: number;
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  isDhakMetro: boolean;
  paymentMethod?: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: "ক্যাশ অন ডেলিভারি",
  mfs: "মোবাইল ব্যাংকিং",
  card: "কার্ড পেমেন্ট",
  bank: "ব্যাংক ট্রান্সফার",
};

const ThankYou = () => {
  const location = useLocation();
  const order = location.state as OrderState | null;
  const { data: settings } = useSettings();

  const timeline = [
    { icon: CheckCircle, label: "অর্ডার কনফার্ম", desc: "আপনার অর্ডার সফলভাবে রেকর্ড হয়েছে", done: true },
    { icon: PhoneCall, label: "ফোন ভেরিফিকেশন", desc: "আমাদের টিম ১-২ ঘন্টার মধ্যে কল করবে", done: false },
    { icon: Package, label: "প্যাকেজিং", desc: "প্রিমিয়াম গ্লাস জারে যত্নসহকারে প্যাক", done: false },
    { icon: Truck, label: "শিপিং", desc: "কুরিয়ার সার্ভিসে হ্যান্ডওভার", done: false },
    { icon: CheckCircle, label: "ডেলিভারি", desc: order?.estimatedDelivery || "শীঘ্রই পৌঁছে যাবে", done: false },
  ];

  const whatsappNumber = settings?.whatsapp_number || "8801XXXXXXXXX";
  const contactPhone = settings?.contact_phone || "01XXXXXXXXX";
  const contactEmail = settings?.contact_email || "info@deshifoods.com";

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 honeycomb-pattern relative overflow-hidden">
      {/* Honey splash background accent */}
      <img
        src={honeySplash}
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] max-w-[90vw] opacity-[0.08] pointer-events-none select-none"
        aria-hidden="true"
      />
      <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-primary/8 blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/4 right-10 text-6xl opacity-10 animate-bee pointer-events-none">🐝</div>

      <Card className="max-w-lg w-full border-primary/20 shadow-2xl bg-card relative z-10">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Success animation */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <PartyPopper className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold mb-1 animate-fade-in">অর্ডার সফল হয়েছে! 🎉</h1>
            <p className="text-muted-foreground text-sm">ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।</p>
          </div>

          {/* Order details */}
          {order && (
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm border border-border">
              <p className="font-semibold mb-2 text-base">📋 অর্ডারের বিবরণ</p>
              {order.orderNumber && (
                <div className="flex justify-between"><span className="text-muted-foreground">অর্ডার নং</span><span className="font-bold text-primary">{order.orderNumber}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">নাম</span><span className="font-medium">{order.name}</span></div>
              {order.phone && (
                <div className="flex justify-between"><span className="text-muted-foreground">ফোন</span><span className="font-medium">{order.phone}</span></div>
              )}
              {order.address && (
                <div className="flex justify-between"><span className="text-muted-foreground">ঠিকানা</span><span className="font-medium text-right max-w-[60%]">{order.address}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">পণ্য</span><span className="font-medium">{order.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">পরিমাণ</span><span className="font-medium">{order.quantity}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">ডেলিভারি</span><span className="font-medium">৳{order.deliveryCharge}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">পেমেন্ট</span><span className="font-medium">{PAYMENT_LABELS[order.paymentMethod || "cod"] || "ক্যাশ অন ডেলিভারি"}</span></div>
              {order.orderDate && (
                <div className="flex justify-between"><span className="text-muted-foreground">তারিখ</span><span className="font-medium">{order.orderDate}</span></div>
              )}
              <div className="flex justify-between"><span className="text-muted-foreground">আনুমানিক ডেলিভারি</span>
                <span className="font-medium text-secondary">{order.estimatedDelivery || "৩-৫ দিন"}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
                <span>মোট</span><span className="text-primary">৳{order.total}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <p className="font-semibold text-sm mb-3">🚚 অর্ডার ট্র্যাকিং</p>
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                    step.done ? "bg-secondary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  {i < timeline.length - 1 && <div className={`w-0.5 h-8 ${step.done ? "bg-secondary/40" : "bg-border"}`} />}
                </div>
                <div className="pb-6">
                  <p className={`font-semibold text-sm ${step.done ? "text-secondary" : ""}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Support section */}
          <div className="bg-muted/50 rounded-xl p-4 border border-border">
            <p className="font-semibold text-sm mb-3">📞 সাপোর্ট</p>
            <div className="space-y-2 text-sm">
              <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4 text-secondary" /> হটলাইন: {contactPhone}
              </a>
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4 text-secondary" /> ইমেইল: {contactEmail}
              </a>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-gradient-cta text-primary-foreground font-bold rounded-2xl py-6 min-h-[52px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp-এ যোগাযোগ করুন
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-2xl py-5 min-h-[48px]">
              <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> হোমে ফিরে যান</Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">🍯 দেশি ফুডস — আপনার বিশ্বস্ত মধু ব্র্যান্ড</p>
        </CardContent>
      </Card>
    </main>
  );
};

export default ThankYou;
