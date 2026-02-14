import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "visitor_session_id";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useVisitorAnalytics() {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const sessionId = getSessionId();

    supabase.from("visitor_analytics").insert({
      session_id: sessionId,
      event_type: "page_view",
      page_url: window.location.pathname,
      referrer_url: document.referrer || null,
      user_agent: navigator.userAgent,
    } as any).then(() => {});
  }, []);

  return { sessionId: getSessionId() };
}

export function trackEvent(eventType: string, metadata?: Record<string, any>) {
  const sessionId = getSessionId();
  supabase.from("visitor_analytics").insert({
    session_id: sessionId,
    event_type: eventType,
    page_url: window.location.pathname,
    metadata: metadata || {},
    user_agent: navigator.userAgent,
  } as any).then(() => {});
}

export function useScrollTracking() {
  useEffect(() => {
    let maxDepth = 0;
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const depth = Math.round((scrollTop / docHeight) * 100);
      if (depth > maxDepth) {
        maxDepth = depth;
        if ([25, 50, 75, 100].includes(depth)) {
          trackEvent("scroll_depth", { depth });
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}
