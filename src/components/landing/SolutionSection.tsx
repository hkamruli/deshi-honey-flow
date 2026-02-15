import FadeSection from "./FadeSection";
import { Badge } from "@/components/ui/badge";
import { Check, X, ShieldCheck, Leaf, Truck } from "lucide-react";

const comparisonData = [
  { feature: "বিশুদ্ধতা", other: "চিনি ও কেমিক্যাল মিশ্রিত", deshi: "১০০% খাঁটি, ল্যাব টেস্টেড" },
  { feature: "উৎস", other: "অজানা, ফ্যাক্টরি প্রসেসড", deshi: "সুন্দরবন ও সিলেট থেকে সরাসরি" },
  { feature: "পুষ্টিগুণ", other: "প্রক্রিয়াজাতে নষ্ট হয়", deshi: "সম্পূর্ণ প্রাকৃতিক এনজাইম অক্ষত" },
  { feature: "প্যাকেজিং", other: "সাধারণ প্লাস্টিক বোতল", deshi: "প্রিমিয়াম গ্লাস জার" },
  { feature: "গ্যারান্টি", other: "কোনো গ্যারান্টি নেই", deshi: "৭ দিনের মানি-ব্যাক গ্যারান্টি" },
  { feature: "ডেলিভারি", other: "বিলম্ব ও অতিরিক্ত চার্জ", deshi: "দ্রুত ডেলিভারি + COD" },
];

const SolutionSection = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ✅ সমাধান
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-gradient-honey">দেশি ফুডস</span> — আপনার বিশ্বস্ত মধু ব্র্যান্ড
            </h2>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 text-sm gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Lab Tested
            </Badge>
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 text-sm gap-1.5">
              <Leaf className="h-4 w-4" /> 100% Organic
            </Badge>
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 text-sm gap-1.5">
              <Truck className="h-4 w-4" /> COD Available
            </Badge>
          </div>

          {/* Desktop: Comparison Table */}
          <div className="hidden md:block bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 text-center font-bold text-sm border-b border-border">
              <div className="p-3 bg-muted"></div>
              <div className="p-3 bg-urgency/5 text-urgency">❌ অন্য মধু</div>
              <div className="p-3 bg-secondary/5 text-secondary">✅ দেশি ফুডস</div>
            </div>
            {comparisonData.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 text-sm ${i < comparisonData.length - 1 ? "border-b border-border" : ""}`}>
                <div className="p-3 font-semibold bg-muted/50">{row.feature}</div>
                <div className="p-3 text-muted-foreground flex items-start gap-1.5">
                  <X className="h-3.5 w-3.5 text-urgency shrink-0 mt-0.5" />
                  <span>{row.other}</span>
                </div>
                <div className="p-3 flex items-start gap-1.5">
                  <Check className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                  <span>{row.deshi}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Stacked Cards */}
          <div className="md:hidden space-y-3">
            {comparisonData.map((row, i) => (
              <div key={i} className="bg-background rounded-xl border border-border p-4 shadow-sm">
                <p className="font-semibold text-sm mb-2">{row.feature}</p>
                <div className="flex items-start gap-2 text-xs text-muted-foreground mb-1.5">
                  <X className="h-3.5 w-3.5 text-urgency shrink-0 mt-0.5" />
                  <span>{row.other}</span>
                </div>
                <div className="flex items-start gap-2 text-xs">
                  <Check className="h-3.5 w-3.5 text-secondary shrink-0 mt-0.5" />
                  <span>{row.deshi}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default SolutionSection;
