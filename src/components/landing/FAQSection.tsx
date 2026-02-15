import { lazy, Suspense } from "react";
import FadeSection from "./FadeSection";

const AccordionContent = lazy(() => 
  import("@/components/ui/accordion").then(mod => ({ default: mod.AccordionContent }))
);

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "আপনাদের মধু কি ১০০% খাঁটি?", a: "হ্যাঁ, আমাদের মধু সম্পূর্ণ খাঁটি ও প্রাকৃতিক। কোনো চিনি, পানি বা কৃত্রিম উপাদান মেশানো হয় না। প্রতিটি ব্যাচ ল্যাবে পরীক্ষিত।" },
  { q: "ডেলিভারি কত দিনে হয়?", a: "ঢাকার ভেতরে ১-২ দিন এবং ঢাকার বাইরে ৩-৫ দিনের মধ্যে ডেলিভারি দেওয়া হয়। সারা বাংলাদেশে ফ্রি ডেলিভারি।" },
  { q: "পেমেন্ট কিভাবে করব?", a: "ক্যাশ অন ডেলিভারি (COD) সুবিধা আছে। পণ্য হাতে পেয়ে পেমেন্ট করুন। এছাড়া বিকাশ/নগদেও পেমেন্ট করা যায়।" },
  { q: "পণ্য পছন্দ না হলে রিটার্ন করতে পারব?", a: "অবশ্যই! পণ্য পেয়ে সন্তুষ্ট না হলে ৭ দিনের মধ্যে রিটার্ন করতে পারবেন। সম্পূর্ণ টাকা ফেরত দেওয়া হবে।" },
  { q: "মধু কিভাবে সংরক্ষণ করব?", a: "ঠাণ্ডা ও শুষ্ক জায়গায় রাখুন। সরাসরি সূর্যের আলো থেকে দূরে রাখুন। ভালোভাবে সংরক্ষণ করলে বছরের পর বছর ভালো থাকে।" },
  { q: "একাধিক অর্ডার করলে কি ডিসকাউন্ট পাব?", a: "হ্যাঁ! কম্বো প্যাকে ২৫% পর্যন্ত ছাড় পাবেন। বেশি পরিমাণে অর্ডারে আরও বিশেষ মূল্য পাওয়া যায়।" },
];

const FAQSection = () => {
  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            সচরাচর জিজ্ঞাসা
          </h2>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-5 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold hover:no-underline text-sm md:text-base">
                  {faq.q}
                </AccordionTrigger>
                <Suspense fallback={null}>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-sm">
                    {faq.a}
                  </AccordionContent>
                </Suspense>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </FadeSection>
  );
};

export default FAQSection;
