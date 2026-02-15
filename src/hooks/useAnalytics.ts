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

    supabase.functions.invoke("track-event", {
      body: {
        action: "track",
        payload: {
          session_id: sessionId,
          event_type: "page_view",
          page_url: window.location.pathname,
          referrer_url: document.referrer || null,
          user_agent: navigator.userAgent,
        },
      },
    }).catch(() => {});
  }, []);

  return { sessionId: getSessionId() };
}

export function trackEvent(eventType: string, metadata?: Record<string, any>) {
  const sessionId = getSessionId();
  supabase.functions.invoke("track-event", {
    body: {
      action: "track",
      payload: {
        session_id: sessionId,
        event_type: eventType,
        page_url: window.location.pathname,
        metadata: metadata || {},
        user_agent: navigator.userAgent,
      },
    },
  }).catch(() => {});
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

export async function saveAbandonedCartViaEdge(
  id: string | null,
  payload: Record<string, any>
): Promise<string | null> {
  try {
    const { data } = await supabase.functions.invoke("track-event", {
      body: {
        action: id ? "abandoned_cart_save" : "abandoned_cart_save",
        payload: { ...payload, id: id || undefined },
      },
    });
    return data?.id || id;
  } catch {
    return id;
  }
}

export async function convertAbandonedCartViaEdge(id: string) {
  try {
    await supabase.functions.invoke("track-event", {
      body: { action: "abandoned_cart_convert", payload: { id } },
    });
  } catch {
    // silent
  }
}
