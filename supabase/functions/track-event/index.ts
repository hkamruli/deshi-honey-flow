import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, payload } = body;

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (action === "track") {
      const { session_id, event_type, page_url, metadata, user_agent, referrer_url } = payload || {};
      if (!event_type || typeof event_type !== "string" || event_type.length > 100) {
        return new Response(JSON.stringify({ error: "Invalid event_type" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      await supabaseAdmin.from("visitor_analytics").insert({
        session_id: typeof session_id === "string" ? session_id.substring(0, 100) : null,
        event_type: event_type.substring(0, 100),
        page_url: typeof page_url === "string" ? page_url.substring(0, 2000) : null,
        metadata: metadata && typeof metadata === "object" ? metadata : {},
        user_agent: typeof user_agent === "string" ? user_agent.substring(0, 500) : null,
        referrer_url: typeof referrer_url === "string" ? referrer_url.substring(0, 2000) : null,
        ip_address: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      });

      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "abandoned_cart_save") {
      const { id, session_id, customer_name, phone, email, district_id, area, full_address, product_variation_id, quantity, user_agent, referrer_url } = payload || {};

      // Validate lengths
      const clean = {
        session_id: typeof session_id === "string" ? session_id.substring(0, 100) : null,
        customer_name: typeof customer_name === "string" ? customer_name.substring(0, 200) : null,
        phone: typeof phone === "string" ? phone.substring(0, 20) : null,
        email: typeof email === "string" ? email.substring(0, 255) : null,
        district_id: district_id || null,
        area: typeof area === "string" ? area.substring(0, 500) : null,
        full_address: typeof full_address === "string" ? full_address.substring(0, 1000) : null,
        product_variation_id: product_variation_id || null,
        quantity: typeof quantity === "number" ? Math.min(Math.max(quantity, 1), 10) : 1,
        user_agent: typeof user_agent === "string" ? user_agent.substring(0, 500) : null,
        referrer_url: typeof referrer_url === "string" ? referrer_url.substring(0, 2000) : null,
      };

      if (id && typeof id === "string") {
        await supabaseAdmin.from("abandoned_carts").update(clean).eq("id", id);
        return new Response(JSON.stringify({ id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        const { data } = await supabaseAdmin.from("abandoned_carts").insert(clean).select("id").single();
        return new Response(JSON.stringify({ id: data?.id || null }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    if (action === "abandoned_cart_convert") {
      const { id } = payload || {};
      if (id && typeof id === "string") {
        await supabaseAdmin.from("abandoned_carts").update({ is_converted: true }).eq("id", id);
      }
      return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Track event error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
