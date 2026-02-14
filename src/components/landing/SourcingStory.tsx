import { TreePine, Mountain } from "lucide-react";

const SourcingStory = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          আমাদের মধু কোথা থেকে আসে?
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-forest/30 rounded-2xl p-8 border border-forest-light/20">
            <div className="w-16 h-16 rounded-full bg-forest-light/20 flex items-center justify-center mb-4">
              <TreePine className="h-8 w-8 text-honey-light" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-honey-light">সুন্দরবন</h3>
            <p className="text-cream/80 leading-relaxed">
              বিশ্বের বৃহত্তম ম্যানগ্রোভ বন সুন্দরবন থেকে মৌয়ালরা ঐতিহ্যবাহী পদ্ধতিতে মধু সংগ্রহ করেন।
              খলিশা, গরান ও বাইন ফুলের মধু — যা স্বাদে ও গুণে অতুলনীয়।
            </p>
          </div>
          <div className="bg-forest/30 rounded-2xl p-8 border border-forest-light/20">
            <div className="w-16 h-16 rounded-full bg-forest-light/20 flex items-center justify-center mb-4">
              <Mountain className="h-8 w-8 text-honey-light" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-honey-light">সিলেট</h3>
            <p className="text-cream/80 leading-relaxed">
              সিলেটের চা বাগান ও পাহাড়ি অঞ্চলের বিভিন্ন বনফুল থেকে সংগৃহীত মধু।
              এই মধুর হালকা সোনালি রং ও ফুলেল সুগন্ধ একে বিশেষ করে তোলে।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SourcingStory;
