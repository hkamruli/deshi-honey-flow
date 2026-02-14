import FadeSection from "./FadeSection";
import { TreePine, Mountain } from "lucide-react";

const SourcingStory = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-accent text-accent-foreground honeycomb-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              আমাদের মধু কোথা থেকে আসে?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-accent-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <TreePine className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-honey">সুন্দরবন</h3>
              <p className="text-sm leading-relaxed opacity-80">
                বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন থেকে মৌয়ালরা ঐতিহ্যবাহী পদ্ধতিতে মধু সংগ্রহ করেন।
                খলিশা, গরান ও বাইন ফুলের মধু — যা স্বাদে ও গুণে অতুলনীয়।
              </p>
            </div>
            <div className="bg-accent-foreground/5 backdrop-blur-sm rounded-2xl p-8 border border-primary/10">
              <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
                <Mountain className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gradient-honey">সিলেট</h3>
              <p className="text-sm leading-relaxed opacity-80">
                সিলেটের চা বাগান ও পাহাড়ি অঞ্চলের বিভিন্ন বনফুল থেকে সংগৃহীত মধু।
                এই মধুর হালকা সোনালি রং ও ফুলেল সুগন্ধ একে বিশেষ করে তোলে।
              </p>
            </div>
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default SourcingStory;
