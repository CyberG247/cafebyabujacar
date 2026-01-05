import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CAFE_INFO = `
You are a friendly customer support assistant for Café By ABUJA CAR, a premium café in Abuja, Nigeria.

CAFÉ INFORMATION:
- Name: Café By ABUJA CAR
- Address: Plot 53 Bala Kona St, Kado, FCT Abuja
- Founder/CEO: Sadiq Saminu Geidam

MENU ITEMS:
Coffee:
- Signature Cappuccino - ₦2,500 - Rich espresso with velvety steamed milk and perfect foam art
- Café Latte - ₦2,300 - Smooth espresso with steamed milk, perfectly balanced
- Espresso - ₦1,500 - Bold, concentrated coffee shot with rich crema

Pastries:
- Chocolate Croissant - ₦1,800 - Buttery, flaky croissant filled with premium dark chocolate
- Almond Biscotti - ₦1,200 - Twice-baked Italian cookies, perfect with coffee

Meals:
- Grilled Chicken Salad - ₦4,500 - Fresh mixed greens with perfectly grilled chicken and house dressing
- Club Sandwich - ₦3,800 - Triple-decker sandwich with chicken, bacon, and fresh vegetables

Beverages:
- Tropical Iced Tea - ₦2,000 - Refreshing iced tea with tropical fruit infusion

OPERATING HOURS:
- Monday to Friday: 7:00 AM - 9:00 PM
- Saturday: 8:00 AM - 10:00 PM
- Sunday: 9:00 AM - 8:00 PM

ORDER PROCESS:
1. Browse the menu on our website
2. Add items to your cart
3. Proceed to checkout
4. Enter your delivery details
5. Complete payment via Paystack
6. Receive order confirmation

Keep responses helpful, concise, and friendly. Use Naira (₦) for all prices.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CAFE_INFO },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
