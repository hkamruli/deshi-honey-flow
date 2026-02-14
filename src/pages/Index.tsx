import { useState, lazy, Suspense } from "react";
import { useVisitorAnalytics, useScrollTracking } from "@/hooks/useAnalytics";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import HoneyDripDivider from "@/components/landing/HoneyDripDivider";

// Lazy load below-fold components
const ProblemSection = lazy(() => import("@/components/landing/ProblemSection"));
const SolutionSection = lazy(() => import("@/components/landing/SolutionSection"));
const SourcingStory = lazy(() => import("@/components/landing/SourcingStory"));
const Testimonials = lazy(() => import("@/components/landing/Testimonials"));
const ValueStack = lazy(() => import("@/components/landing/ValueStack"));
const CountdownTimer = lazy(() => import("@/components/landing/CountdownTimer"));
const ProductOptions = lazy(() => import("@/components/landing/ProductOptions"));
const FAQSection = lazy(() => import("@/components/landing/FAQSection"));
const OrderForm = lazy(() => import("@/components/landing/OrderForm"));
const Footer = lazy(() => import("@/components/landing/Footer"));
const StickyCTA = lazy(() => import("@/components/landing/StickyCTA"));

const LazyFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  useVisitorAnalytics();
  useScrollTracking();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <SocialProofBar />
      <HoneyDripDivider />
      <Suspense fallback={<LazyFallback />}>
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
      </Suspense>
    </main>
  );
};

export default Index;
