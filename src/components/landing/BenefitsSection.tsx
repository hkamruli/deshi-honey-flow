import { Droplets, Leaf, Heart, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const benefits = [
  { icon: Droplets, title: "১০০% খাঁটি", desc: "সরাসরি চাক থেকে সংগ্রহ করা বিশুদ্ধ মধু" },
  { icon: Leaf, title: "প্রাকৃতিক", desc: "কোনো প্রিজারভেটিভ বা কৃত্রিম উপাদান নেই" },
  { icon: Heart, title: "স্বাস্থ্যকর", desc: "রোগ প্রতিরোধ ক্ষমতা বাড়ায় ও শক্তি জোগায়" },
  { icon: Ban, title: "কোনো মিশ্রণ নেই", desc: "চিনি বা অন্য কিছু মেশানো হয় না" },
];

const BenefitsSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          কেন <span className="text-gradient-honey">দেশি ফুডস</span> বেছে নেবেন?
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
          আমাদের মধু সম্পূর্ণ প্রাকৃতিক ও পরীক্ষিত
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {benefits.map((b, i) => (
            <Card key={i} className="border-border/50 bg-card hover:shadow-lg transition-shadow text-center p-2">
              <CardContent className="pt-6 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
                  <b.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
