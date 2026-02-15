import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Truck, Phone, Lock, Plus, Minus } from "lucide-react";
import { useProductVariations, useSettings } from "@/hooks/useData";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, saveAbandonedCartViaEdge, convertAbandonedCartViaEdge } from "@/hooks/useAnalytics";
import FadeSection from "./FadeSection";

interface Props {
  selectedProduct?: any;
}

const DELIVERY_OPTIONS = [
  { value: "dhaka", label: "ঢাকা" },
  { value: "outside_dhaka", label: "ঢাকার বাইরে" },
];

const OrderForm = ({ selectedProduct }: Props) => {
  const navigate = useNavigate();
  const { data: products } = useProductVariations();
  const { data: settings } = useSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    deliveryZone: "",
    area: "",
    address: "",
    productId: "",
    quantity: 1,
    paymentMethod: "cod",
  });
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [highlight, setHighlight] = useState(false);
  const abandonedCartId = useRef<string | null>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasInteracted = useRef(false);
  const submitted = useRef(false);

  // Save partial form data as abandoned cart
  const saveAbandonedCart = useCallback(async (data: typeof formData) => {
    if (submitted.current) return;
    if (!data.name && !data.phone) return;

    const payload = {
      session_id: sessionStorage.getItem("visitor_session_id") || null,
      customer_name: data.name.trim() || null,
      phone: data.phone.trim() || null,
      email: data.email.trim() || null,
      district_id: null,
      area: data.area.trim() || null,
      full_address: data.address.trim() || null,
      product_variation_id: data.productId || null,
      quantity: data.quantity,
      user_agent: navigator.userAgent,
      referrer_url: document.referrer || null,
    };

    const resultId = await saveAbandonedCartViaEdge(abandonedCartId.current, payload);
    if (resultId) abandonedCartId.current = resultId;
  }, []);

  // Debounced save on form change
  useEffect(() => {
    if (!hasInteracted.current) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => saveAbandonedCart(formData), 3000);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [formData, saveAbandonedCart]);

  // Save on page leave
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasInteracted.current && !submitted.current && (formData.name || formData.phone)) {
        saveAbandonedCart(formData);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, saveAbandonedCart]);

  const handleFieldChange = (updates: Partial<typeof formData>) => {
    hasInteracted.current = true;
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // Select product when clicked from product cards
  useEffect(() => {
    if (selectedProduct?.id) {
      setFormData((prev) => ({ ...prev, productId: selectedProduct.id }));
    }
  }, [selectedProduct]);

  // Auto-select first product
  useEffect(() => {
    if (products?.length && !formData.productId) {
      const best = products.find((p: any) => p.sort_order === 3) || products[0];
      setFormData((prev) => ({ ...prev, productId: best.id }));
    }
  }, [products]);

  // Highlight on scroll-to
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && selectedProduct) {
        setHighlight(true);
        setTimeout(() => setHighlight(false), 1500);
      }
    }, { threshold: 0.3 });
    const el = document.getElementById("order-section");
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [selectedProduct]);

  const selected = products?.find((p: any) => p.id === formData.productId);
  const unitPrice = selected?.price || 0;
  const subtotal = unitPrice * formData.quantity;

  const isDhaka = formData.deliveryZone === "dhaka";
  const deliveryChargeActual = isDhaka
    ? Number(settings?.delivery_charge_inside_dhaka || 100)
    : Number(settings?.delivery_charge_outside_dhaka || 150);
  const freeDeliveryEnabled = settings?.free_delivery_enabled !== "false";
  const honeyDipperValue = Number(settings?.honey_dipper_value || 80);
  const discountAmount = Number(settings?.discount_amount || 0);

  // Delivery is free, so actual charge to customer is 0
  const deliveryCharge = freeDeliveryEnabled ? 0 : deliveryChargeActual;
  const total = subtotal + deliveryCharge - discountAmount;

  const validatePhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    if (!cleaned.startsWith("01") || cleaned.length !== 11 || !/^\d+$/.test(cleaned)) {
      return "ফোন নম্বর 01 দিয়ে শুরু হবে এবং ১১ ডিজিট হবে";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) { setPhoneError(phoneErr); return; }

    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      alert("সঠিক ইমেইল দিন");
      return;
    }

    if (!selected || !formData.deliveryZone) return;

    setSubmitting(true);
    submitted.current = true;
    try {
      trackEvent("form_submitted");

      const { data: orderResult, error: fnError } = await supabase.functions.invoke("submit-order", {
        body: {
          customer_name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          district_id: null,
          area: `${isDhaka ? "ঢাকা" : "ঢাকার বাইরে"}${formData.area ? ` - ${formData.area.trim()}` : ""}`,
          full_address: formData.address.trim(),
          product_variation_id: selected.id,
          quantity: formData.quantity,
          unit_price: unitPrice,
          delivery_charge: deliveryCharge,
          total_amount: total > 0 ? total : subtotal,
          payment_method: formData.paymentMethod,
          user_agent: navigator.userAgent,
          referrer_url: document.referrer || null,
          visitor_session_id: sessionStorage.getItem("visitor_session_id") || null,
          abandoned_cart_id: abandonedCartId.current || null,
        },
      });

      if (fnError) throw fnError;
      const orderData = orderResult;

      trackEvent("order_placed", { total, product: selected.name });

      const estDays = isDhaka ? 1 : 3;
      const estimatedDelivery = isDhaka ? "২৪ ঘন্টার মধ্যে" : `${estDays} দিনের মধ্যে`;

      navigate("/thank-you", {
        state: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          product: `${selected.name_bn} (${selected.size_bn})`,
          quantity: formData.quantity,
          total: total > 0 ? total : subtotal,
          deliveryCharge,
          orderNumber: orderData?.order_number || "",
          orderDate: new Date().toLocaleDateString("bn-BD"),
          estimatedDelivery,
          isDhakMetro: isDhaka,
          paymentMethod: formData.paymentMethod,
        },
      });
    } catch (err) {
      console.error("Order error:", err);
      alert("অর্ডার জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  const updateQuantity = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity: Math.min(10, Math.max(1, prev.quantity + delta)),
    }));
  };

  if (!products?.length) return null;

  return (
    <FadeSection>
      <section id="order-section" className="py-16 md:py-24 honeycomb-pattern" style={{ background: "linear-gradient(160deg, hsl(25 40% 10%) 0%, hsl(30 50% 16%) 50%, hsl(38 45% 20%) 100%)" }}>
        <div className="container mx-auto px-4 max-w-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-cream">অর্ডার করুন</h2>
            <p className="text-sm text-cream/60">🚚 ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
          </div>

          <Card className={`border-primary/20 shadow-2xl bg-card transition-all duration-500 ${highlight ? "ring-4 ring-primary/40" : ""}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-center flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-secondary" /> নিরাপদ অর্ডার ফর্ম
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <Label className="text-sm font-semibold">আপনার নাম *</Label>
                  <Input required placeholder="আপনার পুরো নাম" className="mt-1" value={formData.name}
                    onChange={(e) => handleFieldChange({ name: e.target.value })} />
                </div>

                {/* Phone with +880 prefix */}
                <div>
                  <Label className="text-sm font-semibold">ফোন নম্বর *</Label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">+880</span>
                    <Input
                      required
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      className="rounded-l-none"
                      value={formData.phone}
                      onChange={(e) => {
                        handleFieldChange({ phone: e.target.value });
                        setPhoneError("");
                      }}
                    />
                  </div>
                  {phoneError && <p className="text-xs text-urgency mt-1">{phoneError}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label className="text-sm font-semibold">ইমেইল *</Label>
                  <Input required type="email" placeholder="example@gmail.com" className="mt-1" value={formData.email}
                    onChange={(e) => handleFieldChange({ email: e.target.value })} />
                </div>

                {/* Delivery Zone dropdown - simplified */}
                <div>
                  <Label className="text-sm font-semibold">জেলা *</Label>
                  <select
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={formData.deliveryZone}
                    onChange={(e) => handleFieldChange({ deliveryZone: e.target.value })}
                  >
                    <option value="">জেলা নির্বাচন করুন</option>
                    {DELIVERY_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <Label className="text-sm font-semibold">এলাকা</Label>
                  <Input placeholder="থানা / এলাকার নাম" className="mt-1" value={formData.area}
                    onChange={(e) => handleFieldChange({ area: e.target.value })} />
                </div>

                {/* Full address */}
                <div>
                  <Label className="text-sm font-semibold">সম্পূর্ণ ঠিকানা *</Label>
                  <Input required placeholder="বাসা নং, রোড, বিস্তারিত ঠিকানা" className="mt-1" value={formData.address}
                    onChange={(e) => handleFieldChange({ address: e.target.value })} />
                </div>

                {/* Product radio cards */}
                <div>
                  <Label className="text-sm font-semibold mb-2 block">পণ্য নির্বাচন</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {products.map((p: any) => (
                      <label
                        key={p.id}
                        className={`relative cursor-pointer rounded-xl border-2 p-3 text-center transition-all ${
                          formData.productId === p.id
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="product"
                          value={p.id}
                          checked={formData.productId === p.id}
                          onChange={() => handleFieldChange({ productId: p.id })}
                          className="sr-only"
                        />
                        <div className="text-xl mb-1">🍯</div>
                        <p className="font-bold text-xs">{p.size_bn}</p>
                        <p className="text-primary font-extrabold text-sm">৳{p.price}</p>
                        {p.original_price && (
                          <p className="text-[10px] text-muted-foreground line-through">৳{p.original_price}</p>
                        )}
                        {p.badge_bn && (
                          <span className="absolute -top-2 right-1 bg-secondary text-secondary-foreground text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                            {p.badge_bn}
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity with +/- */}
                <div>
                  <Label className="text-sm font-semibold">পরিমাণ</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <Button type="button" variant="outline" size="icon" aria-label="পরিমাণ কমান" onClick={() => updateQuantity(-1)} disabled={formData.quantity <= 1}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-xl font-bold w-12 text-center">{formData.quantity}</span>
                    <Button type="button" variant="outline" size="icon" aria-label="পরিমাণ বাড়ান" onClick={() => updateQuantity(1)} disabled={formData.quantity >= 10}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Payment Method - Cash on Delivery only */}
                <div className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg">💵</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">ক্যাশ অন ডেলিভারি (COD)</p>
                      <p className="text-[11px] text-muted-foreground">পণ্য হাতে পেয়ে পেমেন্ট করুন</p>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted rounded-xl p-4 space-y-2 border border-border">
                  <p className="font-semibold text-sm mb-2">অর্ডার সামারি</p>
                  <div className="flex justify-between text-sm">
                    <span>{selected?.name_bn} ({selected?.size_bn}) × {formData.quantity}</span>
                    <span>৳{subtotal}</span>
                  </div>
                  {/* Delivery charge line */}
                  {formData.deliveryZone && (
                    <div className="flex justify-between text-sm">
                      <span>🚚 ডেলিভারি চার্জ ({isDhaka ? "ঢাকা" : "ঢাকার বাইরে"})</span>
                      <span>৳{deliveryChargeActual}</span>
                    </div>
                  )}
                  {/* Honey dipper line */}
                  <div className="flex justify-between text-sm">
                    <span>🎁 হানি ডিপার</span>
                    <span>৳{honeyDipperValue}</span>
                  </div>

                  {/* Deductions section - always visible */}
                  <div className="border-t border-border pt-2 mt-1">
                    <p className="text-xs text-muted-foreground mb-1">ছাড়সমূহ:</p>
                  </div>
                  {formData.deliveryZone && freeDeliveryEnabled && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span>🚚 ফ্রি ডেলিভারি</span>
                      <span className="font-bold">-৳{deliveryChargeActual}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm text-secondary">
                    <span>🎁 ফ্রি হানি ডিপার</span>
                    <span className="font-bold">-৳{honeyDipperValue}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-secondary">
                      <span>🏷️ বিশেষ ডিসকাউন্ট</span>
                      <span className="font-bold">-৳{discountAmount}</span>
                    </div>
                  )}
                  {/* Savings summary */}
                  <div className="flex justify-between text-xs text-secondary bg-secondary/5 rounded-lg p-2 mt-1">
                    <span>💰 মোট সাশ্রয়</span>
                    <span className="font-bold">৳{(formData.deliveryZone && freeDeliveryEnabled ? deliveryChargeActual : 0) + honeyDipperValue + discountAmount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-border pt-2 mt-1">
                    <span>মোট পরিশোধযোগ্য</span>
                    <span className="text-primary">৳{total > 0 ? total : subtotal}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-cta text-primary-foreground font-bold text-lg py-7 rounded-full glow-cta hover:scale-[1.02] transition-all"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" /><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" /></svg>
                      প্রসেসিং...
                    </span>
                  ) : (
                    <>👉 অর্ডার কনফার্ম করুন</>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
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
