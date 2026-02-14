import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MessageCircle, ArrowLeft, Truck } from "lucide-react";

interface OrderState {
  name: string;
  product: string;
  quantity: number;
  total: number;
}

const ThankYou = () => {
  const location = useLocation();
  const order = location.state as OrderState | null;

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-border bg-card">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-forest/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-forest-light" />
          </div>

          <div>
            <h1 className="text-2xl font-bold mb-2">
              অর্ডার সফল হয়েছে! 🎉
            </h1>
            <p className="text-muted-foreground">
              আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে।
            </p>
          </div>

          {order && (
            <div className="bg-muted rounded-lg p-4 text-left space-y-2 text-sm">
              <p><span className="font-semibold">নাম:</span> {order.name}</p>
              <p><span className="font-semibold">পণ্য:</span> {order.product}</p>
              <p><span className="font-semibold">পরিমাণ:</span> {order.quantity}</p>
              <p className="font-bold text-base border-t border-border pt-2">
                মোট: <span className="text-primary">৳{order.total}</span>
              </p>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4 flex items-start gap-3 text-left">
            <Truck className="h-5 w-5 text-forest-light mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold">ডেলিভারি তথ্য</p>
              <p className="text-muted-foreground">
                ঢাকায় ১-২ দিন, ঢাকার বাইরে ৩-৫ দিনের মধ্যে পৌঁছে যাবে।
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              asChild
              className="w-full bg-forest text-secondary-foreground font-bold rounded-full"
            >
              <a href="https://wa.me/8801XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                হোয়াটসঅ্যাপে যোগাযোগ করুন
              </a>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                হোমে ফিরে যান
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ThankYou;
