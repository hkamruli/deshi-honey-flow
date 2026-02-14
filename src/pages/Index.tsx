import { useState } from "react";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import BenefitsSection from "@/components/landing/BenefitsSection";
import SourcingStory from "@/components/landing/SourcingStory";
import ProductOptions, { Product } from "@/components/landing/ProductOptions";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import CountdownTimer from "@/components/landing/CountdownTimer";
import OrderForm from "@/components/landing/OrderForm";
import StickyCTA from "@/components/landing/StickyCTA";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <main className="min-h-screen">
      <HeroSection />
      <SocialProofBar />
      <BenefitsSection />
      <SourcingStory />
      <CountdownTimer />
      <ProductOptions onSelectProduct={setSelectedProduct} />
      <Testimonials />
      <FAQSection />
      <OrderForm selectedProduct={selectedProduct} />
      <Footer />
      <StickyCTA />
    </main>
  );
};

export default Index;
