import { useState, lazy, Suspense } from "react";
import { useVisitorAnalytics, useScrollTracking } from "@/hooks/useAnalytics";
import HeroSection from "@/components/landing/HeroSection";
import SocialProofBar from "@/components/landing/SocialProofBar";
import HoneyDripDivider from "@/components/landing/HoneyDripDivider";
const StickyCTA = lazy(() => import("@/components/landing/StickyCTA"));

// Lazy load below-fold components
const ProblemSection = lazy(() => import("@/components/landing/ProblemSection"));
const SolutionSection = lazy(() => import("@/components/landing/SolutionSection"));
const SourcingStory = lazy(() => import("@/components/landing/SourcingStory"));
const CountdownTimer = lazy(() => import("@/components/landing/CountdownTimer"));
const Footer = lazy(() => import("@/components/landing/Footer"));
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
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ProblemSection />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <SolutionSection />
        <SourcingStory />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <Testimonials />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ValueStack />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50px]" />}>
        <CountdownTimer />
      </Suspense>
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <ProductOptions onSelectProduct={setSelectedProduct} />
      </Suspense>
      <HoneyDripDivider />
      <Suspense fallback={<div className="min-h-[200px]" />}>
        <FAQSection />
        <OrderForm selectedProduct={selectedProduct} />
      </Suspense>
      <Suspense fallback={<div className="min-h-[100px]" />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <StickyCTA />
      </Suspense>
    </main>
  );
};

export default Index;
