import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import AnimatedBee from "./AnimatedBee";
import FloatingPollen from "./FloatingPollen";

const HeroSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // 24-hour reset timer
  const getTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const isUrgent = timeLeft.hours < 2;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden honeycomb-pattern"
      style={{ background: "linear-gradient(160deg, hsl(25 20% 8%) 0%, hsl(16 60% 18%) 40%, hsl(30 70% 25%) 100%)" }}
    >
      <FloatingPollen />
      <AnimatedBee />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative z-20 container mx-auto px-4 py-16 text-center">
        {/* Urgency badge */}
        <Badge className="mb-5 bg-urgency text-primary-foreground text-sm px-5 py-2 animate-pulse rounded-full shadow-lg">
          🔥 আজকের অফার – সীমিত সময়
        </Badge>

        {/* Brand */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-tight">
          <span className="text-gradient-honey drop-shadow-lg">দেশি ফুডস</span>
        </h1>

        {/* Honey jar */}
        <div className="text-6xl md:text-8xl mb-4 drop-shadow-xl">🍯</div>

        <p className="text-xl md:text-2xl font-bold mb-2 text-cream">
          সুন্দরবন ও সিলেটের খাঁটি মধু
        </p>
        <p className="text-sm md:text-base text-cream/60 mb-6 max-w-md mx-auto">
          ১০০% প্রাকৃতিক — কোনো চিনি নেই, কোনো কেমিক্যাল নেই
        </p>

        {/* Countdown timer */}
        <div className="mb-6">
          <p className="text-cream/50 text-xs mb-2">⏰ অফার শেষ হচ্ছে</p>
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-extrabold">
            {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((v, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-cream/40">:</span>}
                <span className={`px-2.5 py-1.5 rounded-lg min-w-[44px] inline-block ${
                  isUrgent ? "bg-urgency/80 text-primary-foreground" : "bg-cream/10 text-cream"
                }`}>
                  {v}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={scrollToOrder}
          size="lg"
          className="bg-gradient-cta text-primary-foreground font-bold text-base md:text-lg px-10 py-7 rounded-full glow-cta hover:scale-105 transition-all duration-300 animate-pulse-glow"
        >
          👉 ফ্রি গিফটসহ এখনই অর্ডার করুন
          <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>

        <p className="mt-4 text-cream/40 text-xs">🚚 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি</p>
      </div>
    </section>
  );
};

export default HeroSection;
