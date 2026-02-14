import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "ফাতেমা বেগম",
    location: "ঢাকা",
    text: "দেশি ফুডসের মধু খেয়ে বুঝলাম আসল মধু কাকে বলে! বাজারের মধুর সাথে তুলনাই হয় না।",
    rating: 5,
  },
  {
    name: "রহিম উদ্দিন",
    location: "চট্টগ্রাম",
    text: "আমার পরিবার নিয়মিত এই মধু খায়। সর্দি-কাশি অনেক কমে গেছে। অসাধারণ মান!",
    rating: 5,
  },
  {
    name: "সুমাইয়া আক্তার",
    location: "সিলেট",
    text: "প্যাকেজিং খুব সুন্দর, ডেলিভারি দ্রুত। মধুর স্বাদ অসাধারণ। সবাইকে রেকমেন্ড করি!",
    rating: 5,
  },
  {
    name: "কামাল হোসেন",
    location: "রাজশাহী",
    text: "৩ বার অর্ডার করেছি, প্রতিবারই একই মান পেয়েছি। ক্যাশ অন ডেলিভারি সুবিধাও আছে।",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          আমাদের গ্রাহকরা কী বলছেন
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          সারা বাংলাদেশ থেকে সন্তুষ্ট গ্রাহকদের মতামত
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <Card key={i} className="border-border/50 bg-card">
              <CardContent className="pt-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-4 w-4 ${j < t.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
