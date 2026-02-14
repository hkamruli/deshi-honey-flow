import { Star, Users, ShieldCheck } from "lucide-react";

const SocialProofBar = () => {
  return (
    <section className="bg-accent text-accent-foreground py-4">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm md:text-base font-medium">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <span>৫০০০+ পরিবার আমাদের বিশ্বাস করে</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-primary text-primary" />
            ))}
          </div>
          <span>৪.৯/৫ রেটিং</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-forest-light" />
          <span>১০০% সন্তুষ্টি গ্যারান্টি</span>
        </div>
      </div>
    </section>
  );
};

export default SocialProofBar;
