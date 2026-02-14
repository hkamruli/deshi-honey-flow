import FadeSection from "./FadeSection";
import { Star, BadgeCheck } from "lucide-react";

const testimonials = [
  { name: "ফাতেমা বেগম", location: "ঢাকা", text: "দেশি ফুডসের মধু খেয়ে বুঝলাম আসল মধু কাকে বলে! বাজারের মধুর সাথে তুলনাই হয় না।", rating: 5 },
  { name: "রহিম উদ্দিন", location: "চট্টগ্রাম", text: "আমার পরিবার নিয়মিত এই মধু খায়। সর্দি-কাশি অনেক কমে গেছে। অসাধারণ মান!", rating: 5 },
  { name: "সুমাইয়া আক্তার", location: "সিলেট", text: "প্যাকেজিং খুব সুন্দর, ডেলিভারি দ্রুত। মধুর স্বাদ অসাধারণ। সবাইকে রেকমেন্ড করি!", rating: 5 },
  { name: "কামাল হোসেন", location: "রাজশাহী", text: "৩ বার অর্ডার করেছি, প্রতিবারই একই মান পেয়েছি। ক্যাশ অন ডেলিভারি সুবিধাও আছে।", rating: 5 },
  { name: "নাসরিন জাহান", location: "খুলনা", text: "বাচ্চাদের জন্য নিরাপদ মধু খুঁজছিলাম, দেশি ফুডস দিয়ে ১০০% সন্তুষ্ট।", rating: 5 },
  { name: "আবদুল করিম", location: "বরিশাল", text: "সুন্দরবনের মধুর আসল স্বাদ পেলাম এত দিন পর। ধন্যবাদ দেশি ফুডস!", rating: 5 },
  { name: "রুমানা পারভীন", location: "ময়মনসিংহ", text: "গত ৬ মাস ধরে অর্ডার করছি। একবারও হতাশ হইনি। সেরা মধু!", rating: 5 },
  { name: "শাহাদাত হোসেন", location: "কুমিল্লা", text: "দাম একটু বেশি মনে হলেও কোয়ালিটি বুঝলে এটাই সেরা দাম।", rating: 4 },
  { name: "তাসনিম ফারিয়া", location: "গাজীপুর", text: "আমার মা ডায়াবেটিক, ডাক্তার খাঁটি মধু খেতে বলেছেন। দেশি ফুডসের মধু নিশ্চিন্তে দিচ্ছি।", rating: 5 },
  { name: "মোহাম্মদ জাকির", location: "নারায়ণগঞ্জ", text: "WhatsApp-এ অর্ডার দিলাম, পরদিনই পেয়ে গেলাম। সার্ভিস অসাম!", rating: 5 },
  { name: "সাবিনা ইয়াসমিন", location: "রংপুর", text: "উপহার হিসেবে পাঠিয়েছিলাম, সবাই খুশি। প্যাকেজিং প্রিমিয়াম ছিল।", rating: 5 },
  { name: "আনিসুর রহমান", location: "যশোর", text: "সিলেটের চা বাগানের ফুলের মধু — স্বাদ আর সুগন্ধ অতুলনীয়।", rating: 5 },
  { name: "মিতু দেওয়ান", location: "বান্দরবান", text: "অনেক জায়গা থেকে মধু কিনেছি, কিন্তু এত ভালো মধু আর কোথাও পাইনি।", rating: 5 },
  { name: "হাসান মাহমুদ", location: "টাঙ্গাইল", text: "কম্বো প্যাক নিয়েছিলাম, দাম সাশ্রয়ী ছিল। এবার আবার অর্ডার দেব।", rating: 5 },
  { name: "ফারজানা আলম", location: "সাভার", text: "COD সুবিধা থাকায় নিশ্চিন্তে অর্ডার দিয়েছি। মধু হাতে পেয়ে টাকা দিয়েছি।", rating: 4 },
];

const Testimonials = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-muted/30 honeycomb-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐ গ্রাহকদের মতামত
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              ৫০০০+ সন্তুষ্ট গ্রাহক
            </h2>
            <p className="text-muted-foreground">সারা বাংলাদেশ থেকে Verified Purchase রিভিউ</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-5 border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 ${j < t.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                
                <p className="text-sm text-foreground mb-4 leading-relaxed">"{t.text}"</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-xs">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground">{t.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-secondary text-[10px] font-medium">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default Testimonials;
