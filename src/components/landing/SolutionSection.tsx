import FadeSection from "./FadeSection";
import { ShieldCheck, Award, Leaf, Beaker } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "১০০% বিশুদ্ধ", desc: "ল্যাব টেস্টেড ও সার্টিফাইড খাঁটি মধু" },
  { icon: Leaf, title: "সম্পূর্ণ প্রাকৃতিক", desc: "কোনো প্রিজারভেটিভ বা কৃত্রিম উপাদান নেই" },
  { icon: Award, title: "প্রিমিয়াম কোয়ালিটি", desc: "সুন্দরবন ও সিলেটের সেরা মধু" },
  { icon: Beaker, title: "কোনো মিশ্রণ নেই", desc: "চিনি, পানি বা অন্য কিছু মেশানো হয় না" },
];

const SolutionSection = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✅ সমাধান
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-gradient-honey">দেশি ফুডস</span> — আপনার বিশ্বস্ত মধু ব্র্যান্ড
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              আমরা সরাসরি মৌয়ালদের কাছ থেকে মধু সংগ্রহ করে আপনার ঘরে পৌঁছে দিই
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-base mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default SolutionSection;
