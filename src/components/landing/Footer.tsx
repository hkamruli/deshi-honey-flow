import { memo } from "react";
import logo from "@/assets/logo-small.webp";

const Footer = memo(() => {
  return (
    <footer className="py-10" style={{ background: "linear-gradient(160deg, hsl(20 25% 8%) 0%, hsl(25 30% 12%) 50%, hsl(20 20% 6%) 100%)" }}>
      <div className="container mx-auto px-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src={logo} alt="Fresh Foods Logo" width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" loading="lazy" />
          <p className="text-2xl font-bold text-gradient-honey">দেশি ফুডস</p>
        </div>
        <p className="text-sm text-cream/70">সুন্দরবন ও সিলেটের খাঁটি মধু — সরাসরি আপনার ঘরে</p>
        <div className="flex items-center justify-center gap-4 text-xs text-cream/50">
          <span>📞 ০১৮৬৮৩৭১৬৭৪</span>
          <span>📧 info@deshifoods.com</span>
        </div>
        <p className="text-xs text-cream/50">📍 Feni, Bangladesh</p>
        <p className="text-xs text-cream/30">© ২০২৬ দেশি ফুডস। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
