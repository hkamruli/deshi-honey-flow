import FadeSection from "./FadeSection";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowDown } from "lucide-react";

const painPoints = [
  { emoji: "🧪", title: "কেমিক্যাল মিশ্রিত মধু", desc: "বাজারের মধুতে ক্ষতিকর কেমিক্যাল ও প্রিজারভেটিভ মেশানো হয় যা লিভার ও কিডনির ক্ষতি করে।" },
  { emoji: "🍬", title: "চিনির সিরাপ যুক্ত", desc: "সস্তা চিনির সিরাপ মিশিয়ে ভেজাল মধু তৈরি করা হয় যা ডায়াবেটিস ও ওজন বাড়ায়।" },
  { emoji: "💔", title: "পুষ্টিগুণ শূন্য", desc: "প্রক্রিয়াজাত মধুতে আসল মধুর পুষ্টিগুণ, এনজাইম ও অ্যান্টিঅক্সিডেন্ট থাকে না।" },
  { emoji: "🎭", title: "নকল ব্র্যান্ডিং", desc: "আকর্ষণীয় প্যাকেজিংয়ে ভেজাল মধু বিক্রি করা হয়, ক্রেতারা সহজে ধরতে পারেন না।" },
];

const ProblemSection = () => {
  const scrollToOrder = () => {
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-background honeycomb-pattern">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-urgency/10 text-urgency px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⚠️ সতর্কতা
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              বাজারের <span className="text-urgency">৮০% মধুই ভেজাল!</span>
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto">
              আপনি কি জানেন যে বাংলাদেশে বিক্রি হওয়া বেশিরভাগ মধু আসল নয়?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-card rounded-xl p-5 border border-urgency/10 shadow-sm flex gap-4 items-start">
                <div className="shrink-0 mt-1">
                  <XCircle className="h-5 w-5 text-urgency" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{p.emoji}</span>
                    <h3 className="font-bold text-sm">{p.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              onClick={scrollToOrder}
              className="bg-gradient-cta text-primary-foreground font-bold px-8 py-6 rounded-full glow-cta hover:scale-105 transition-all"
            >
              👉 আসল মধু অর্ডার করুন
              <ArrowDown className="ml-2 h-4 w-4 animate-bounce" />
            </Button>
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default ProblemSection;
