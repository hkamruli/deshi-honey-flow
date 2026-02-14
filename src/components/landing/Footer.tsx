import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="py-10 bg-foreground text-background/60">
      <div className="container mx-auto px-4 text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <img src={logo} alt="Fresh Foods Logo" className="w-10 h-10 rounded-full object-cover border-2 border-primary/30" />
          <p className="text-2xl font-bold text-gradient-honey">দেশি ফুডস</p>
        </div>
        <p className="text-sm">সুন্দরবন ও সিলেটের খাঁটি মধু — সরাসরি আপনার ঘরে</p>
        <div className="flex items-center justify-center gap-4 text-xs opacity-60">
          <span>📞 ০১৮৬৮৩৭১৬৭৪</span>
          <span>📧 info@deshifoods.com</span>
        </div>
        <p className="text-xs opacity-60">📍 Feni, Bangladesh</p>
        <p className="text-xs opacity-40">© ২০২৬ দেশি ফুডস। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};

export default Footer;
