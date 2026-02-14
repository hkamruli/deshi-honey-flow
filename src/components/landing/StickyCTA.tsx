import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <Button
        onClick={() => document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" })}
        className="bg-gradient-cta text-primary-foreground font-bold px-8 py-6 rounded-full shadow-2xl glow-cta hover:scale-105 transition-all duration-300 text-base animate-fade-in"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        এখনই অর্ডার করুন
      </Button>
    </div>
  );
};

export default StickyCTA;
