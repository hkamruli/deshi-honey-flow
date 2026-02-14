import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-hero text-secondary-foreground overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-honey-light/10 blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <Badge className="mb-6 bg-primary text-primary-foreground text-sm px-4 py-1.5 animate-pulse">
          🔥 সীমিত স্টক!
        </Badge>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
          <span className="text-honey-light">দেশি ফুডস</span>
        </h1>
        
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-cream/90">
          সুন্দরবন ও সিলেটের খাঁটি মধু
        </p>
        <p className="text-lg md:text-xl text-cream/70 mb-8 max-w-2xl mx-auto">
          ১০০% প্রাকৃতিক ও বিশুদ্ধ মধু — কোনো মিশ্রণ নেই, কোনো কেমিক্যাল নেই। সরাসরি আপনার ঘরে পৌঁছে যাবে।
        </p>
        
        <Button
          onClick={scrollToOrder}
          size="lg"
          className="bg-gradient-honey text-primary-foreground font-bold text-lg px-10 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        >
          এখনই অর্ডার করুন
          <ArrowDown className="ml-2 h-5 w-5 animate-bounce" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
