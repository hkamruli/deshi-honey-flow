const Footer = () => {
  return (
    <footer className="py-10 bg-foreground text-background/60">
      <div className="container mx-auto px-4 text-center space-y-3">
        <p className="text-2xl font-bold text-gradient-honey">দেশি ফুডস</p>
        <p className="text-sm">সুন্দরবন ও সিলেটের খাঁটি মধু — সরাসরি আপনার ঘরে</p>
        <div className="flex items-center justify-center gap-4 text-xs opacity-60">
          <span>📞 ০১XXXXXXXXX</span>
          <span>📧 info@deshifoods.com</span>
        </div>
        <p className="text-xs opacity-40">© ২০২৬ দেশি ফুডস। সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
};

export default Footer;
