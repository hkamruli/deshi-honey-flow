import { useRef, useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { useTestimonials } from "@/hooks/useData";
import FadeSection from "./FadeSection";

// Male avatars
const MALE_AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face",
];

// Female avatars
const FEMALE_AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
];

// Popup male avatars (different from review set)
const POPUP_MALE_AVATARS = [
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=100&h=100&fit=crop&crop=face",
];

// Popup female avatars (different from review set)
const POPUP_FEMALE_AVATARS = [
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face",
];

// Bengali female name keywords
const FEMALE_NAME_HINTS = ["ফাতেমা", "সুমাইয়া", "নাসরিন", "রুমানা", "তাসনিম", "সাবিনা", "মিতু", "ফারজানা", "বেগম", "আক্তার", "জাহান", "পারভীন", "ফারিয়া", "ইয়াসমিন", "আলম", "রাহেলা", "ফাতিমা", "সুমি"];

const isFemale = (name: string) => FEMALE_NAME_HINTS.some((hint) => name.includes(hint));

const getReviewAvatar = (name: string, index: number) => {
  const pool = isFemale(name) ? FEMALE_AVATARS : MALE_AVATARS;
  return pool[index % pool.length];
};

const Testimonials = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll marquee using CSS-based approach to avoid forced reflows
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !testimonials?.length) return;

    // Cache scrollWidth once to avoid reading it every frame
    let cachedHalfWidth = el.scrollWidth / 2;
    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5;

    // Recalculate on resize
    const resizeObserver = new ResizeObserver(() => {
      cachedHalfWidth = el.scrollWidth / 2;
    });
    resizeObserver.observe(el);

    const animate = () => {
      if (!isPaused && el) {
        scrollPos += speed;
        if (scrollPos >= cachedHalfWidth) {
          scrollPos = 0;
        }
        el.scrollLeft = scrollPos;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [testimonials, isPaused]);

  // Recent order popup
  const [recentOrder, setRecentOrder] = useState<{ name: string; district: string; avatar: string } | null>(null);

  useEffect(() => {
    const names = ["রাহেলা", "করিম", "ফাতিমা", "জাহিদ", "নাসরিন", "সাকিব", "তানভীর", "সুমি"];
    const districts = ["ঢাকা", "চট্টগ্রাম", "সিলেট", "রাজশাহী", "খুলনা", "গাজীপুর"];

    const show = () => {
      const name = names[Math.floor(Math.random() * names.length)];
      const female = isFemale(name);
      const pool = female ? POPUP_FEMALE_AVATARS : POPUP_MALE_AVATARS;
      setRecentOrder({
        name,
        district: districts[Math.floor(Math.random() * districts.length)],
        avatar: pool[Math.floor(Math.random() * pool.length)],
      });
      setTimeout(() => setRecentOrder(null), 4000);
    };

    const interval = setInterval(show, 15000);
    const initial = setTimeout(show, 5000);
    return () => { clearInterval(interval); clearTimeout(initial); };
  }, []);

  // Live visitor counter
  const [visitors, setVisitors] = useState(Math.floor(Math.random() * 18) + 8);
  useEffect(() => {
    const interval = setInterval(() => {
      setVisitors(Math.floor(Math.random() * 18) + 8);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) return null;

  const items = testimonials || [];
  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <FadeSection>
      <section className="py-16 md:py-24 bg-muted/30 honeycomb-pattern relative overflow-hidden">
        {/* Recent order popup */}
         {recentOrder && (
            <div className="fixed bottom-20 left-4 z-50 bg-card border border-border rounded-xl shadow-xl p-3 flex items-center gap-3 animate-fade-in max-w-[280px]">
             <img
               src={recentOrder.avatar}
               alt=""
               className="w-10 h-10 rounded-full object-cover shrink-0"
               loading="lazy"
             />
             <div className="text-xs">
               <p className="font-semibold">{recentOrder.name} ({recentOrder.district})</p>
               <p className="text-muted-foreground">এইমাত্র অর্ডার করেছেন!</p>
             </div>
           </div>
         )}

        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐ গ্রাহকদের মতামত
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              ৫০০০+ সন্তুষ্ট গ্রাহক
            </h2>
            <p className="text-muted-foreground text-sm">সারা বাংলাদেশ থেকে Verified Purchase রিভিউ</p>
          </div>

          {/* Live visitor counter */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-muted-foreground">এখন <span className="font-bold text-foreground">{visitors} জন</span> দেখছেন</span>
            </div>
          </div>

          {/* Scrolling testimonials */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-hidden cursor-grab"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {doubled.map((t: any, i) => (
              <div
                key={`${t.id}-${i}`}
                className="min-w-[280px] max-w-[300px] bg-card rounded-xl p-5 border border-border shadow-sm shrink-0"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3.5 w-3.5 ${j < t.rating ? "fill-primary text-primary" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed line-clamp-4">"{t.review_text}"</p>
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <img
                       src={getReviewAvatar(t.name, i)}
                       alt={t.name}
                       className="w-8 h-8 rounded-full object-cover"
                       loading="lazy"
                     />
                     <div>
                       <p className="font-semibold text-xs">{t.name}</p>
                       <p className="text-[10px] text-muted-foreground">{t.district}</p>
                     </div>
                   </div>
                   {t.is_verified && (
                     <div className="flex items-center gap-1 text-secondary text-[10px] font-medium">
                       <BadgeCheck className="h-3.5 w-3.5" />
                       <span>Verified Purchase</span>
                     </div>
                   )}
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </FadeSection>
  );
};

export default Testimonials;
