import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { products, Product } from "./ProductOptions";
import { ShieldCheck, Truck, Phone } from "lucide-react";

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

  // Sync selected product from parent
  useState(() => {
    if (selectedProduct) {
      setFormData((prev) => ({ ...prev, product: selectedProduct.id }));
    }
  });

  const selected = products.find((p) => p.id === formData.product) || products[1];
  const total = selected.price * formData.quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `🍯 *দেশি ফুডস - নতুন অর্ডার*\n\n` +
      `👤 নাম: ${formData.name}\n` +
      `📞 ফোন: ${formData.phone}\n` +
      `📍 ঠিকানা: ${formData.address}\n` +
      `📦 পণ্য: ${selected.name} (${selected.size})\n` +
      `🔢 পরিমাণ: ${formData.quantity}\n` +
      `💰 মোট: ৳${total}\n` +
      `💳 পেমেন্ট: ক্যাশ অন ডেলিভারি`;

    const whatsappUrl = `https://wa.me/8801XXXXXXXXX?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    navigate("/thank-you", {
      state: {
        name: formData.name,
        product: `${selected.name} (${selected.size})`,
        quantity: formData.quantity,
        total,
      },
    });
  };

  return (
    <section id="order-section" className="py-16 md:py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          অর্ডার করুন
        </h2>
        <p className="text-center text-cream/70 mb-8">
          ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে পেমেন্ট করুন
        </p>

        <Card className="border-border bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="text-xl text-center">অর্ডার ফর্ম</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">আপনার নাম *</Label>
                <Input
                  id="name"
                  required
                  placeholder="আপনার পুরো নাম লিখুন"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">ফোন নম্বর *</Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="address">ডেলিভারি ঠিকানা *</Label>
                <Input
                  id="address"
                  required
                  placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="product">পণ্য নির্বাচন</Label>
                <select
                  id="product"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
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
                <Label htmlFor="quantity">পরিমাণ</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
              </div>

              {/* Order summary */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{selected.name} ({selected.size}) × {formData.quantity}</span>
                  <span>৳{total}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                  <span>মোট</span>
                  <span className="text-primary">৳{total}</span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-honey text-primary-foreground font-bold text-lg py-6 rounded-full hover:scale-[1.02] transition-transform"
              >
                অর্ডার কনফার্ম করুন ✅
              </Button>

              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> নিরাপদ অর্ডার</span>
                <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> দ্রুত ডেলিভারি</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> ২৪/৭ সাপোর্ট</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default OrderForm;
