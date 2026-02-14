import FadeSection from "./FadeSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Truck, Shield, ArrowDown, Sparkles } from "lucide-react";
import { useBonuses, useProductVariations } from "@/hooks/useData";
import honeyJarSmall from "@/assets/honey-jar-small.png";

const ValueStack = () => {
  const { data: bonuses } = useBonuses();
  const { data: products } = useProductVariations();

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate total value
  const totalBonusValue = bonuses?.reduce((sum: number, b: any) => sum + (b.value || 0), 0) || 0;
  const bestProduct = products?.find((p: any) => p.sort_order === 3); // 1kg
  const bestPrice = bestProduct?.price || 1000;
  const bestOriginal = bestProduct?.original_price || 1200;
  const totalStackValue = bestOriginal + totalBonusValue;
  const savingsPercent = Math.round(((totalStackValue - bestPrice) / totalStackValue) * 100);

  const staticItems = [
    { icon: Check, text: "১০০% খাঁটি সুন্দরবনের / সিলেটের মধু" },
    { icon: Truck, text: "সারা বাংলাদেশে ফ্রি ডেলিভারি" },
    { icon: Shield, text: "৭ দিনের মানি-ব্যাক গ্যারান্টি" },
    { icon: Gift, text: "প্রিমিয়াম গ্লাস জার প্যাকেজিং" },
    { icon: Check, text: "ক্যাশ অন ডেলিভারি (COD) সুবিধা" },
  ];

  const bonusItems = bonuses?.filter((b: any) => b.display_mode === "variation_based" && b.value > 0)
    .map((b: any) => ({ icon: Sparkles, text: `${b.name_bn} (মূল্য ৳${b.value})` })) || [];

  const allItems = [...staticItems, ...bonusItems];

  return (
    <FadeSection>
      <section className="py-16 md:py-24" style={{ background: "linear-gradient(160deg, hsl(25 20% 8%) 0%, hsl(16 60% 18%) 100%)" }}>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center">
            <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🎁 বিশেষ অফার
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-cream">
              আজ অর্ডার করলে যা যা পাচ্ছেন
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Honey jar visual */}
          <div className="hidden md:block flex-shrink-0">
            <div className="relative w-40 h-40">
              <img src={honeyJarSmall} alt="খাঁটি মধু" className="w-full h-full object-contain drop-shadow-xl" loading="lazy" />
              <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-2xl scale-90" />
            </div>
          </div>

          <div className="flex-1 max-w-lg mx-auto md:mx-0">

          <div className="space-y-3 text-left mb-8">
            {allItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-cream/5 rounded-lg p-3 border border-cream/10">
                <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                  <item.icon className="h-3.5 w-3.5 text-secondary" />
                </div>
                <span className="text-cream/90 text-sm">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Value summary */}
          <div className="bg-cream/5 border border-cream/10 rounded-xl p-5 mb-8 text-cream">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-cream/60">মোট মূল্য</span>
              <span className="line-through text-cream/40">৳{totalStackValue}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>আজকের অফারে</span>
              <span className="text-primary">৳{bestPrice}</span>
            </div>
            <div className="text-center mt-2">
              <Badge className="bg-urgency text-primary-foreground">{savingsPercent}% সাশ্রয়!</Badge>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={scrollToOrder}
              size="lg"
              className="bg-gradient-cta text-primary-foreground font-bold text-base px-10 py-7 rounded-full glow-cta hover:scale-105 transition-all animate-pulse-glow"
            >
              👉 ফ্রি গিফটসহ এখনই অর্ডার করুন
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>
          </div>
          </div>
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default ValueStack;
