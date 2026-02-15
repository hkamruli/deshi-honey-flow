import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import AnimatedBee from "./AnimatedBee";
import FloatingPollen from "./FloatingPollen";
const honeyJarHero = "/images/honey-jar-hero.png";
import logo from "@/assets/logo-small.webp";

const HeroSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

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
      className="relative overflow-hidden honeycomb-pattern"
      style={{ background: "linear-gradient(160deg, hsl(20 30% 6%) 0%, hsl(25 50% 14%) 35%, hsl(35 60% 20%) 70%, hsl(30 45% 16%) 100%)" }}
    >
      <FloatingPollen />
      <AnimatedBee />

      {/* Logo + Brand at top-left corner */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-2.5">
        <img src={logo} alt="Fresh Foods Logo" width={48} height={48} className="w-12 h-12 rounded-full object-cover border-2 border-primary/40 shadow-lg" />
        <span className="text-cream font-extrabold text-lg md:text-xl tracking-tight drop-shadow-lg" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>দেশি ফুডস</span>
      </div>

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[100px]" />

      <div className="relative z-20 max-w-[1140px] mx-auto px-6 md:px-10 lg:px-14 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-8 md:gap-12 items-center">
          {/* Left: Text content */}
          <div className="text-center md:text-left">
            <Badge className="mb-4 bg-urgency text-primary-foreground text-sm px-5 py-2 animate-pulse rounded-full shadow-lg">
              🔥 আজকের অফার – সীমিত সময়
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight">
              <span className="text-gradient-honey drop-shadow-lg">দেশি ফুডস</span>
            </h1>

            <p className="text-lg md:text-xl font-bold mb-1.5 text-cream">
              সুন্দরবন ও সিলেটের খাঁটি মধু
            </p>
            <p className="text-sm text-cream/60 mb-5 max-w-sm md:mx-0 mx-auto">
              ১০০% প্রাকৃতিক — কোনো চিনি নেই, কোনো কেমিক্যাল নেই
            </p>

            {/* Countdown timer */}
            <div className="mb-5">
              <p className="text-cream/50 text-xs mb-1.5">⏰ অফার শেষ হচ্ছে</p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-lg md:text-xl font-extrabold">
                {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((v, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-cream/40">:</span>}
                    <span className={`px-2 py-1 rounded-lg min-w-[40px] inline-block text-center ${
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
              className="bg-gradient-cta text-primary-foreground font-bold text-base px-8 py-6 rounded-full glow-cta hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              👉 ফ্রি গিফটসহ এখনই অর্ডার করুন
              <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
            </Button>

            <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-cream/50 text-xs">
              <span>✓ ফ্রি ডেলিভারি</span>
              <span>✓ ক্যাশ অন ডেলিভারি</span>
              <span>✓ ৭ দিনের গ্যারান্টি</span>
            </div>
          </div>

          {/* Right: Honey jar */}
          <div className="flex justify-center md:justify-end">
            <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
              style={{ background: "linear-gradient(145deg, hsl(35 60% 30% / 0.5) 0%, hsl(25 50% 20% / 0.6) 100%)", boxShadow: "inset 0 2px 20px hsl(35 80% 50% / 0.15), 0 8px 32px hsl(0 0% 0% / 0.3)" }}>
              <div className="relative w-56 h-72 md:w-72 md:h-[360px]">
                <img
                  src={honeyJarHero}
                  alt="Fresh Foods - Natural Honey"
                  width={288}
                  height={384}
                  className="w-full h-full object-contain drop-shadow-2xl animate-fade-in"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              {/* Discount badge */}
              <div className="absolute bottom-4 right-4 bg-urgency/90 text-primary-foreground px-3 py-1.5 rounded-lg shadow-lg text-center">
                <p className="text-[10px] leading-none mb-0.5">বিশেষ অফার</p>
                <p className="text-lg font-extrabold leading-none">৪৪% ছাড়</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
