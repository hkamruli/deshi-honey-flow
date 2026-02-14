import { useState } from "react";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import SourcingStory from "@/components/landing/SourcingStory";
import Testimonials from "@/components/landing/Testimonials";
import ValueStack from "@/components/landing/ValueStack";
import CountdownTimer from "@/components/landing/CountdownTimer";
import ProductOptions, { Product } from "@/components/landing/ProductOptions";
import FAQSection from "@/components/landing/FAQSection";
import OrderForm from "@/components/landing/OrderForm";
import HoneyDripDivider from "@/components/landing/HoneyDripDivider";
import StickyCTA from "@/components/landing/StickyCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <SocialProofBar />
      <HoneyDripDivider />
      <ProblemSection />
      <HoneyDripDivider />
      <SolutionSection />
      <SourcingStory />
      <HoneyDripDivider />
      <Testimonials />
      <HoneyDripDivider />
      <ValueStack />
      <CountdownTimer />
      <ProductOptions onSelectProduct={setSelectedProduct} />
      <HoneyDripDivider />
      <FAQSection />
      <OrderForm selectedProduct={selectedProduct} />
      <Footer />
      <StickyCTA />
    </main>
  );
};

export default Index;
