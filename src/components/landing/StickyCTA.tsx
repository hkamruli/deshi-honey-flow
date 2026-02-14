import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
      <Button
        onClick={() => document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-gradient-honey text-primary-foreground font-bold px-8 py-6 rounded-full shadow-2xl hover:scale-105 transition-transform text-base"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        এখনই অর্ডার করুন
      </Button>
    </div>
  );
};

export default StickyCTA;
