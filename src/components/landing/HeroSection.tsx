import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import AnimatedBee from "./AnimatedBee";
import FloatingPollen from "./FloatingPollen";

const HeroSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden honeycomb-pattern"
      style={{ background: "linear-gradient(160deg, hsl(25 20% 8%) 0%, hsl(16 60% 18%) 40%, hsl(30 70% 25%) 100%)" }}
    >
      <FloatingPollen />
      <AnimatedBee />
      
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />
      
      <div className="relative z-20 container mx-auto px-4 py-20 text-center">
        {/* Urgency badge */}
        <Badge className="mb-6 bg-urgency text-primary-foreground text-sm px-5 py-2 animate-pulse rounded-full shadow-lg">
          🔥 সীমিত স্টক — আজই অর্ডার করুন!
        </Badge>
        
        {/* Brand */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight tracking-tight">
          <span className="text-gradient-honey drop-shadow-lg">দেশি ফুডস</span>
        </h1>
        
        {/* Honey jar emoji as visual */}
        <div className="text-6xl md:text-8xl mb-6 drop-shadow-xl">🍯</div>
        
        {/* Headline */}
        <p className="text-xl md:text-3xl font-bold mb-3 text-cream">
          সুন্দরবন ও সিলেটের খাঁটি মধু
        </p>
        <p className="text-base md:text-lg text-cream/70 mb-8 max-w-xl mx-auto leading-relaxed">
          ১০০% প্রাকৃতিক — কোনো চিনি নেই, কোনো কেমিক্যাল নেই।
          <br />
          সরাসরি চাক থেকে আপনার ঘরে।
        </p>
        
        {/* CTA */}
        <Button
          onClick={scrollToOrder}
          size="lg"
          className="bg-gradient-cta text-primary-foreground font-bold text-lg px-12 py-7 rounded-full glow-cta hover:scale-105 transition-all duration-300"
        >
          এখনই অর্ডার করুন
          <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
        
        <p className="mt-4 text-cream/50 text-sm">🚚 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</p>
      </div>
    </section>
  );
};

export default HeroSection;
