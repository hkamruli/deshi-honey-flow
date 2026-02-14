import FadeSection from "./FadeSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Gift, Truck, Shield, ArrowDown, Sparkles } from "lucide-react";
import { useBonuses, useProductVariations, useSettings } from "@/hooks/useData";
import honeyJarHero from "@/assets/honey-jar-hero.png";
import honeyDipper from "@/assets/honey-dipper.png";

const ValueStack = () => {
  const { data: bonuses } = useBonuses();
  const { data: products } = useProductVariations();
  const { data: settings } = useSettings();

  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter out recipe book from bonuses
  const filteredBonuses = bonuses?.filter((b: any) => b.name !== "Recipe Book") || [];

  // Calculate total value (excluding recipe book)
  const totalBonusValue = filteredBonuses.reduce((sum: number, b: any) => sum + (b.value || 0), 0);
  const deliveryValue = Number(settings?.delivery_charge_outside_dhaka || 150);
  const bestProduct = products?.find((p: any) => p.sort_order === 3); // 1kg
  const bestPrice = bestProduct?.price || 1000;
  const bestOriginal = bestProduct?.original_price || 1200;
  const totalStackValue = bestOriginal + totalBonusValue + deliveryValue;
  const savingsPercent = Math.round(((totalStackValue - bestPrice) / totalStackValue) * 100);

  const honeyDipperBonus = filteredBonuses.find((b: any) => b.name === "Free Honey Dipper");
  const honeyDipperValue = honeyDipperBonus?.value || 80;

  const staticItems = [
    { icon: Check, text: "১০০% খাঁটি সুন্দরবনের / সিলেটের মধু" },
    { icon: Truck, text: `ফ্রি ডেলিভারি (মূল্য ৳${deliveryValue})` },
    { icon: Shield, text: "৭ দিনের মানি-ব্যাক গ্যারান্টি" },
    { icon: Gift, text: "প্রিমিয়াম গ্লাস জার প্যাকেজিং" },
    { icon: Check, text: "ক্যাশ অন ডেলিভারি (COD) সুবিধা" },
  ];

  // Only show variation_based bonuses excluding recipe book and honey dipper (shown separately)
  const bonusItems = filteredBonuses
    .filter((b: any) => b.display_mode === "variation_based" && b.value > 0 && b.name !== "Free Honey Dipper")
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
            {/* Product images */}
            <div className="flex-shrink-0 space-y-4">
              {/* Honey jar */}
              <div className="relative rounded-2xl overflow-hidden p-6"
                style={{ background: "linear-gradient(145deg, hsl(35 60% 30% / 0.5) 0%, hsl(25 50% 20% / 0.6) 100%)", boxShadow: "inset 0 2px 20px hsl(35 80% 50% / 0.15), 0 8px 32px hsl(0 0% 0% / 0.3)" }}>
                <div className="relative w-48 h-60 md:w-56 md:h-72">
                  <img src={honeyJarHero} alt="Fresh Foods - Natural Honey" className="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />
                </div>
              </div>
              {/* Honey dipper */}
              <div className="relative rounded-2xl overflow-hidden p-4"
                style={{ background: "linear-gradient(145deg, hsl(35 60% 30% / 0.4) 0%, hsl(25 50% 20% / 0.5) 100%)", boxShadow: "inset 0 2px 16px hsl(35 80% 50% / 0.1), 0 4px 20px hsl(0 0% 0% / 0.25)" }}>
                <div className="text-center">
                  <div className="relative w-32 h-32 md:w-40 md:h-40 mx-auto">
                    <img src={honeyDipper} alt="ফ্রি হানি ডিপার" className="w-full h-full object-contain drop-shadow-2xl" loading="lazy" />
                  </div>
                  <p className="text-cream/80 text-xs mt-2 font-medium">🎁 ফ্রি হানি ডিপার <span className="line-through text-cream/40">৳{honeyDipperValue}</span></p>
                </div>
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
                {/* Honey dipper as separate highlighted item */}
                <div className="flex items-center gap-3 bg-primary/10 rounded-lg p-3 border border-primary/20">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Gift className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-cream/90 text-sm">ফ্রি হানি ডিপার (<span className="line-through text-cream/40">৳{honeyDipperValue}</span> <span className="text-secondary font-bold">ফ্রি!</span>)</span>
                </div>
              </div>

              {/* Value summary */}
              <div className="bg-cream/5 border border-cream/10 rounded-xl p-5 mb-8 text-cream">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream/60">পণ্যের মূল্য</span>
                  <span className="line-through text-cream/40">৳{bestOriginal}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream/60">ডেলিভারি চার্জ</span>
                  <span className="line-through text-cream/40">৳{deliveryValue}</span>
                  <span className="text-secondary text-xs font-bold ml-1">ফ্রি</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cream/60">হানি ডিপার</span>
                  <span className="line-through text-cream/40">৳{honeyDipperValue}</span>
                  <span className="text-secondary text-xs font-bold ml-1">ফ্রি</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cream/60">মোট মূল্য</span>
                  <span className="line-through text-cream/40">৳{totalStackValue}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-cream/10 pt-2">
                  <span>আজকের অফারে</span>
                  <span className="text-primary">৳{bestPrice}</span>
                </div>
                <div className="text-center mt-2">
                  <Badge className="bg-urgency text-primary-foreground">{savingsPercent}% সাশ্রয়!</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
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
      </section>
    </FadeSection>
  );
};

export default ValueStack;
