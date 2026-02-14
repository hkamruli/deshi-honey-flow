import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "আপনাদের মধু কি ১০০% খাঁটি?",
    a: "হ্যাঁ, আমাদের মধু সম্পূর্ণ খাঁটি ও প্রাকৃতিক। কোনো চিনি, পানি বা কৃত্রিম উপাদান মেশানো হয় না। প্রতিটি ব্যাচ পরীক্ষিত।",
  },
  {
    q: "ডেলিভারি কত দিনে হয়?",
    a: "ঢাকার ভেতরে ১-২ দিন এবং ঢাকার বাইরে ৩-৫ দিনের মধ্যে ডেলিভারি দেওয়া হয়।",
  },
  {
    q: "পেমেন্ট কিভাবে করব?",
    a: "ক্যাশ অন ডেলিভারি (COD) সুবিধা আছে। পণ্য হাতে পেয়ে পেমেন্ট করুন। এছাড়া বিকাশ/নগদেও পেমেন্ট করা যায়।",
  },
  {
    q: "পণ্য পছন্দ না হলে রিটার্ন করতে পারব?",
    a: "অবশ্যই! পণ্য পেয়ে সন্তুষ্ট না হলে ৭ দিনের মধ্যে রিটার্ন করতে পারবেন। সম্পূর্ণ টাকা ফেরত দেওয়া হবে।",
  },
  {
    q: "মধু কিভাবে সংরক্ষণ করব?",
    a: "ঠাণ্ডা ও শুষ্ক জায়গায় রাখুন। সরাসরি সূর্যের আলো থেকে দূরে রাখুন। ভালোভাবে সংরক্ষণ করলে বছরের পর বছর ভালো থাকে।",
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          সচরাচর জিজ্ঞাসা
        </h2>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-lg border px-4">
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
