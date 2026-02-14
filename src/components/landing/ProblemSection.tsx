import FadeSection from "./FadeSection";
import { AlertTriangle } from "lucide-react";

const ProblemSection = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-accent/5 honeycomb-pattern">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-urgency/10 text-urgency px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <AlertTriangle className="h-4 w-4" />
            আপনি কি জানেন?
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            বাজারের <span className="text-urgency">৮০% মধুই ভেজাল</span> 😔
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            চিনির সিরাপ, কেমিক্যাল আর কৃত্রিম রং মিশিয়ে তৈরি করা হচ্ছে নকল মধু।
            এই ভেজাল মধু আপনার ও আপনার পরিবারের স্বাস্থ্যের জন্য ক্ষতিকর।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            {[
              { emoji: "🧪", text: "কেমিক্যাল মিশ্রিত — লিভার ও কিডনির ক্ষতি করে" },
              { emoji: "🍬", text: "চিনির সিরাপ যুক্ত — ডায়াবেটিস বাড়ায়" },
              { emoji: "💔", text: "পুষ্টিগুণ শূন্য — শরীরের কোনো উপকারে আসে না" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-5 border border-urgency/10 shadow-sm"
              >
                <span className="text-2xl mb-2 block">{item.emoji}</span>
                <p className="text-sm font-medium text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default ProblemSection;
