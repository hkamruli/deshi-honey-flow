import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
  originalPrice?: number;
  badge?: string;
}

export const products: Product[] = [
  { id: "500g", name: "খাঁটি মধু", size: "৫০০ গ্রাম", price: 550, originalPrice: 650 },
  { id: "1kg", name: "খাঁটি মধু", size: "১ কেজি", price: 1000, originalPrice: 1200, badge: "সবচেয়ে জনপ্রিয়" },
  { id: "combo", name: "ফ্যামিলি কম্বো", size: "২ কেজি", price: 1800, originalPrice: 2400, badge: "সেরা মূল্য" },
];

interface Props {
  onSelectProduct?: (product: Product) => void;
}

const ProductOptions = ({ onSelectProduct }: Props) => {
  const scrollToOrder = (product: Product) => {
    onSelectProduct?.(product);
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          আমাদের পণ্যসমূহ
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          আপনার পরিবারের জন্য সঠিক প্যাকেজটি বেছে নিন
        </p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {products.map((p, i) => (
            <Card
              key={p.id}
              className={`relative border-2 transition-all hover:shadow-xl ${
                i === 1 ? "border-primary scale-[1.03] shadow-lg" : "border-border hover:border-primary/50"
              }`}
            >
              {p.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                  {p.badge}
                </Badge>
              )}
              <CardHeader className="text-center pb-2 pt-8">
                <div className="text-5xl mb-3">🍯</div>
                <CardTitle className="text-xl">{p.name}</CardTitle>
                <p className="text-muted-foreground font-medium">{p.size}</p>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">৳{p.price}</span>
                  {p.originalPrice && (
                    <span className="text-muted-foreground line-through ml-2 text-lg">
                      ৳{p.originalPrice}
                    </span>
                  )}
                </div>
                <Button
                  onClick={() => scrollToOrder(p)}
                  className="w-full bg-gradient-honey text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  অর্ডার করুন
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductOptions;
