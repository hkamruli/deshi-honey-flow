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
    const {
      customer_name, phone, email, district_id, area, full_address,
      product_variation_id, quantity, unit_price, delivery_charge,
      total_amount, payment_method, user_agent, referrer_url,
      visitor_session_id, abandoned_cart_id,
    } = body;

    // Server-side validation
    if (!customer_name || typeof customer_name !== "string" || customer_name.trim().length === 0 || customer_name.trim().length > 200) {
      return new Response(JSON.stringify({ error: "Invalid name" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!phone || typeof phone !== "string" || !/^01[0-9]{9}$/.test(phone.trim())) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (email && (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!full_address || typeof full_address !== "string" || full_address.trim().length === 0 || full_address.trim().length > 1000) {
      return new Response(JSON.stringify({ error: "Invalid address" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!product_variation_id || typeof product_variation_id !== "string") {
      return new Response(JSON.stringify({ error: "Invalid product" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!quantity || typeof quantity !== "number" || quantity < 1 || quantity > 10) {
      return new Response(JSON.stringify({ error: "Invalid quantity" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (typeof unit_price !== "number" || unit_price < 0) {
      return new Response(JSON.stringify({ error: "Invalid price" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (typeof total_amount !== "number" || total_amount < 0) {
      return new Response(JSON.stringify({ error: "Invalid total" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Rate limit check
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { data: allowed } = await supabaseAdmin.rpc("check_rate_limit", { p_ip: clientIp, p_action: "order_submission" });
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Too many requests. Please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify product exists
    const { data: product } = await supabaseAdmin.from("product_variations").select("id, price").eq("id", product_variation_id).eq("is_active", true).single();
    if (!product) {
      return new Response(JSON.stringify({ error: "Invalid product" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: orderData, error } = await supabaseAdmin.from("orders").insert({
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      email: email?.trim() || null,
      district_id: district_id || null,
      area: area?.trim() || null,
      full_address: full_address.trim(),
      product_variation_id,
      quantity,
      unit_price,
      delivery_charge: delivery_charge || 0,
      total_amount,
      payment_method: payment_method || "cod",
      ip_address: clientIp,
      user_agent: typeof user_agent === "string" ? user_agent.substring(0, 500) : null,
      referrer_url: typeof referrer_url === "string" ? referrer_url.substring(0, 2000) : null,
      visitor_session_id: typeof visitor_session_id === "string" ? visitor_session_id.substring(0, 100) : null,
    }).select("order_number").single();

    if (error) throw error;

    // Mark abandoned cart as converted
    if (abandoned_cart_id && typeof abandoned_cart_id === "string") {
      await supabaseAdmin.from("abandoned_carts").update({ is_converted: true }).eq("id", abandoned_cart_id);
    }

    return new Response(JSON.stringify({ order_number: orderData.order_number }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Order submission error:", err);
    return new Response(JSON.stringify({ error: "Failed to submit order" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
