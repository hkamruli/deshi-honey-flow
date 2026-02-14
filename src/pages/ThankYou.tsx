import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle, ArrowLeft, Package, Truck, Phone, PartyPopper } from "lucide-react";

interface OrderState {
  name: string;
  product: string;
  quantity: number;
  total: number;
}

const ThankYou = () => {
  const location = useLocation();
  const order = location.state as OrderState | null;

  const timeline = [
    { icon: CheckCircle, label: "অর্ডার গ্রহণ", desc: "আপনার অর্ডার সফলভাবে রেকর্ড হয়েছে", active: true },
    { icon: Phone, label: "কনফার্মেশন কল", desc: "আমাদের টিম শীঘ্রই আপনাকে কল করবে", active: false },
    { icon: Package, label: "প্যাকেজিং", desc: "প্রিমিয়াম গ্লাস জারে যত্নসহকারে প্যাক", active: false },
    { icon: Truck, label: "ডেলিভারি", desc: "ঢাকায় ১-২ দিন, ঢাকার বাইরে ৩-৫ দিন", active: false },
  ];

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 honeycomb-pattern">
      <Card className="max-w-md w-full border-primary/20 shadow-2xl bg-card">
        <CardContent className="pt-8 pb-8 space-y-6">
          {/* Success animation */}
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/15 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <PartyPopper className="h-10 w-10 text-secondary" />
            </div>
            <h1 className="text-2xl font-bold mb-1">
              অর্ডার সফল হয়েছে! 🎉
            </h1>
            <p className="text-muted-foreground text-sm">
              ধন্যবাদ! আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
            </p>
          </div>

          {/* Order details */}
          {order && (
            <div className="bg-muted rounded-xl p-4 space-y-2 text-sm border border-border">
              <p className="font-semibold mb-2">অর্ডারের বিবরণ</p>
              <div className="flex justify-between"><span className="text-muted-foreground">নাম</span><span className="font-medium">{order.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">পণ্য</span><span className="font-medium">{order.product}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">পরিমাণ</span><span className="font-medium">{order.quantity}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">পেমেন্ট</span><span className="font-medium">Cash on Delivery</span></div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-1">
                <span>মোট</span>
                <span className="text-primary">৳{order.total}</span>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-0">
            <p className="font-semibold text-sm mb-3">এরপর কী হবে?</p>
            {timeline.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    step.active ? "bg-secondary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    <step.icon className="h-4 w-4" />
                  </div>
                  {i < timeline.length - 1 && (
                    <div className="w-0.5 h-8 bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <p className={`font-semibold text-sm ${step.active ? "text-secondary" : ""}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-gradient-cta text-primary-foreground font-bold rounded-full py-5"
            >
              <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp-এ যোগাযোগ করুন
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                হোমে ফিরে যান
              </Link>
            </Button>
          </div>

          {/* Trust closure */}
          <p className="text-center text-xs text-muted-foreground">
            🍯 দেশি ফুডস — আপনার বিশ্বস্ত মধু ব্র্যান্ড
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default ThankYou;
