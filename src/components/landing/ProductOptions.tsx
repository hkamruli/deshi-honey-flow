import FadeSection from "./FadeSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useProductVariations, useBonuses, useSettings } from "@/hooks/useData";

interface Props {
  onSelectProduct?: (product: any) => void;
}

const ProductOptions = ({ onSelectProduct }: Props) => {
  const { data: products } = useProductVariations();
  const { data: bonuses } = useBonuses();
  const { data: settings } = useSettings();

  const stockCount = Math.max(5, Number(settings?.stock_counter_number || 23));

  const scrollToOrder = (product: any) => {
    onSelectProduct?.(product);
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!products?.length) return null;

  const globalBonuses = bonuses?.filter((b: any) => b.display_mode === "global") || [];

  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">আপনার প্যাকেজ বেছে নিন</h2>
            <p className="text-muted-foreground text-sm">সব প্যাকেজে ফ্রি ডেলিভারি + ৭ দিনের গ্যারান্টি</p>
          </div>

          {/* Stock counter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-urgency/10 text-urgency px-4 py-2 rounded-full text-sm font-semibold">
              📦 মাত্র <span className="font-extrabold">{stockCount}</span> টি স্টকে আছে!
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {products.map((p: any, i: number) => {
              const savings = p.original_price ? p.original_price - p.price : 0;
              const isPopular = i === 1;
              const isBestValue = i === 2;

              return (
                <Card
                  key={p.id}
                  className={`relative border-2 transition-all duration-300 hover:shadow-xl ${
                    isBestValue
                      ? "border-primary scale-[1.02] shadow-lg ring-2 ring-primary/20"
                      : isPopular
                      ? "border-secondary/50"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {p.badge_bn && (
                    <Badge className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 text-xs whitespace-nowrap ${
                      isBestValue ? "bg-urgency text-primary-foreground" : "bg-secondary text-secondary-foreground"
                    }`}>
                      {p.badge_bn}
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-1 pt-7 px-3">
                    <div className="text-4xl mb-2">🍯</div>
                    <CardTitle className="text-sm md:text-base">{p.name_bn}</CardTitle>
                    <p className="text-xs text-muted-foreground">{p.size_bn}</p>
                  </CardHeader>
                  <CardContent className="text-center space-y-3 px-3 pb-5">
                    <div>
                      <span className="text-2xl md:text-3xl font-extrabold">৳{p.price}</span>
                      {p.original_price && (
                        <span className="text-muted-foreground line-through ml-1 text-sm">
                          ৳{p.original_price}
                        </span>
                      )}
                      {savings > 0 && (
                        <p className="text-xs text-secondary font-semibold mt-0.5">৳{savings} সাশ্রয়</p>
                      )}
                      {p.per_unit_label && (
                        <p className="text-[10px] text-muted-foreground">{p.per_unit_label}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => scrollToOrder(p)}
                      className={`w-full font-bold rounded-full py-4 text-xs hover:scale-105 transition-all ${
                        isBestValue
                          ? "bg-gradient-cta text-primary-foreground glow-cta"
                          : "bg-gradient-honey text-primary-foreground"
                      }`}
                    >
                      <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                      অর্ডার করুন
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Global bonuses */}
          {globalBonuses.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {globalBonuses.map((b: any) => (
                <span key={b.id} className="text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium">
                  ✅ {b.name_bn}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>
    </FadeSection>
  );
};

export default ProductOptions;
