import FadeSection from "./FadeSection";
import { Button } from "@/components/ui/button";
import { Check, Gift, Truck, Shield, ArrowDown } from "lucide-react";

const ValueStack = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            🎁 বিশেষ অফার
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            আজ অর্ডার করলে যা যা পাচ্ছেন
          </h2>
          
          <div className="space-y-4 text-left mb-10">
            {[
              { icon: Check, text: "১০০% খাঁটি সুন্দরবনের / সিলেটের মধু" },
              { icon: Truck, text: "সারা বাংলাদেশে ফ্রি ডেলিভারি" },
              { icon: Shield, text: "৭ দিনের মানি-ব্যাক গ্যারান্টি" },
              { icon: Gift, text: "কম্বো প্যাকে ২৫% পর্যন্ত ছাড়" },
              { icon: Check, text: "প্রিমিয়াম গ্লাস জার প্যাকেজিং" },
              { icon: Check, text: "ক্যাশ অন ডেলিভারি (COD) সুবিধা" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-accent-foreground/5 rounded-lg p-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-secondary" />
                </div>
                <span className="font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={scrollToOrder}
            size="lg"
            className="bg-gradient-cta text-primary-foreground font-bold text-lg px-12 py-7 rounded-full glow-cta hover:scale-105 transition-all duration-300"
          >
            এখনই অর্ডার করুন
            <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
          </Button>
        </div>
      </section>
    </FadeSection>
  );
};

export default ValueStack;
