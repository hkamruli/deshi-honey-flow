import { useState, lazy, Suspense } from "react";
import { useVisitorAnalytics, useScrollTracking } from "@/hooks/useAnalytics";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import HoneyDripDivider from "@/components/landing/HoneyDripDivider";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import SourcingStory from "@/components/landing/SourcingStory";
import CountdownTimer from "@/components/landing/CountdownTimer";
import Footer from "@/components/landing/Footer";
import StickyCTA from "@/components/landing/StickyCTA";

// Lazy load heavier below-fold components
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const ValueStack = lazy(() => import("@/components/landing/ValueStack"));
const ProductOptions = lazy(() => import("@/components/landing/ProductOptions"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const OrderForm = lazy(() => import("@/components/landing/OrderForm"));

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  useVisitorAnalytics();
  useScrollTracking();

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
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Testimonials />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ValueStack />
      </Suspense>
      <CountdownTimer />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ProductOptions onSelectProduct={setSelectedProduct} />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <FAQSection />
        <OrderForm selectedProduct={selectedProduct} />
      </Suspense>
      <Footer />
      <StickyCTA />
    </main>
  );
};

export default Index;
