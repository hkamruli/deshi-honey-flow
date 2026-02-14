import { Star, Users, ShieldCheck, Truck } from "lucide-react";

const SocialProofBar = () => {
  return (
    <section className="bg-card border-y border-border py-5">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm font-medium text-foreground">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>৫০০০+ সন্তুষ্ট পরিবার</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span>৪.৯/৫ রেটিং</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-secondary" />
          <span>মানি-ব্যাক গ্যারান্টি</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-secondary" />
          <span>সারা দেশে ডেলিভারি</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
