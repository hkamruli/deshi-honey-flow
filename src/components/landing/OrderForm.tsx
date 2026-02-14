import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, Product } from "./ProductOptions";
import { ShieldCheck, Truck, Phone, Lock } from "lucide-react";
import FadeSection from "./FadeSection";

interface Props {
  selectedProduct?: Product | null;
}

const OrderForm = ({ selectedProduct }: Props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    product: selectedProduct?.id || "1kg",
    quantity: 1,
  });

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product: selectedProduct.id }));
    }
  }, [selectedProduct]);

  const selected = products.find((p) => p.id === formData.product) || products[1];
  const total = selected.price * formData.quantity;

  // Multi-quantity discount
  const discount = formData.quantity >= 3 ? 0.1 : formData.quantity >= 2 ? 0.05 : 0;
  const discountAmount = Math.round(total * discount);
  const finalTotal = total - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = `🍯 *দেশি ফুডস - নতুন অর্ডার*\n\n` +
      `👤 নাম: ${formData.name}\n` +
      `📞 ফোন: ${formData.phone}\n` +
      `📍 ঠিকানা: ${formData.address}\n` +
      `📦 পণ্য: ${selected.name} (${selected.size})\n` +
      `🔢 পরিমাণ: ${formData.quantity}\n` +
      `💰 মোট: ৳${finalTotal}\n` +
      `💳 পেমেন্ট: ক্যাশ অন ডেলিভারি`;

    const whatsappUrl = `https://wa.me/8801XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    navigate("/thank-you", {
      state: {
        name: formData.name,
        product: `${selected.name} (${selected.size})`,
        quantity: formData.quantity,
        total: finalTotal,
      },
    });
  };

  return (
    <FadeSection>
      <section id="order-section" className="py-16 md:py-24 bg-accent text-accent-foreground honeycomb-pattern">
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              অর্ডার করুন
            </h2>
            <p className="text-sm opacity-70">
              🚚 ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে পেমেন্ট করুন
            </p>
          </div>

          <Card className="border-primary/20 shadow-xl bg-card text-card-foreground">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-secondary" />
                নিরাপদ অর্ডার ফর্ম
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-semibold">আপনার নাম *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="আপনার পুরো নাম লিখুন"
                    className="mt-1"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-semibold">ফোন নম্বর *</Label>
                  <Input
                    id="phone"
                    required
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    className="mt-1"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-sm font-semibold">ডেলিভারি ঠিকানা *</Label>
                  <Input
                    id="address"
                    required
                    placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                    className="mt-1"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="product" className="text-sm font-semibold">পণ্য নির্বাচন</Label>
                  <select
                    id="product"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground mt-1"
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.size}) — ৳{p.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-semibold">পরিমাণ</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={10}
                    className="mt-1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Math.max(1, Number(e.target.value)) })}
                  />
                  {formData.quantity >= 2 && (
                    <p className="text-xs text-secondary font-medium mt-1">
                      🎉 {formData.quantity >= 3 ? "১০%" : "৫%"} মাল্টি-কোয়ান্টিটি ডিসকাউন্ট প্রযোজ্য!
                    </p>
                  )}
                </div>

                {/* Order summary */}
                <div className="bg-muted rounded-xl p-4 space-y-2 border border-border">
                  <p className="font-semibold text-sm mb-2">অর্ডার সামারি</p>
                  <div className="flex justify-between text-sm">
                    <span>{selected.name} ({selected.size}) × {formData.quantity}</span>
                    <span>৳{total}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span>ডিসকাউন্ট ({Math.round(discount * 100)}%)</span>
                      <span>-৳{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>ডেলিভারি</span>
                    <span className="text-secondary font-medium">ফ্রি</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-2">
                    <span>মোট</span>
                    <span className="text-primary">৳{finalTotal}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-cta text-primary-foreground font-bold text-lg py-7 rounded-full glow-cta hover:scale-[1.02] transition-all duration-300"
                >
                  অর্ডার কনফার্ম করুন ✅
                </Button>

                <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> নিরাপদ</span>
                  <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> ফ্রি ডেলিভারি</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> ২৪/৭ সাপোর্ট</span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </FadeSection>
  );
};

export default OrderForm;
