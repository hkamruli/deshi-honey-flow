import { useEffect, useRef, ReactNode, forwardRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

const FadeSection = forwardRef<HTMLDivElement, Props>(({ children, className = "" }, forwardedRef) => {
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

  useEffect(() => {
    const el = typeof ref === "object" && ref?.current ? ref.current : internalRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={internalRef} className={`fade-section ${className}`}>
      {children}
    </div>
  );
});

FadeSection.displayName = "FadeSection";

export default FadeSection;
