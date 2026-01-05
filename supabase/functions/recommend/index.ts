import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MENU_DATA = `
Available menu items:
1. Signature Cappuccino (Coffee) - ₦2,500 - Rich espresso with velvety steamed milk and perfect foam art. Great for coffee lovers who enjoy a balanced, creamy coffee.
2. Café Latte (Coffee) - ₦2,300 - Smooth espresso with steamed milk. Perfect for those who prefer a milder coffee taste.
3. Espresso (Coffee) - ₦1,500 - Bold, concentrated coffee shot. For those who love strong, pure coffee.
4. Chocolate Croissant (Pastry) - ₦1,800 - Buttery, flaky pastry with dark chocolate. Perfect for sweet tooth and pastry lovers.
5. Almond Biscotti (Pastry) - ₦1,200 - Italian cookies perfect with coffee. Great for a light snack.
6. Grilled Chicken Salad (Meal) - ₦4,500 - Fresh and healthy meal option. Great for health-conscious customers.
7. Club Sandwich (Meal) - ₦3,800 - Hearty sandwich with chicken and bacon. Perfect for a filling meal.
8. Tropical Iced Tea (Beverage) - ₦2,000 - Refreshing and fruity. Great for hot days or those who don't drink coffee.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Based on the following customer preferences, recommend 3 menu items from Café By ABUJA CAR. 

Customer preferences: ${preferences}

${MENU_DATA}

Respond with a JSON array of exactly 3 recommendations. Each recommendation should have:
- id: the product id (1-8)
- name: product name
- reason: a short personalized reason why this item suits their preferences (1 sentence)

Example format:
[
  {"id": "1", "name": "Signature Cappuccino", "reason": "Perfect for your love of creamy coffee drinks."},
  {"id": "4", "name": "Chocolate Croissant", "reason": "A sweet treat to complement your coffee."},
  {"id": "8", "name": "Tropical Iced Tea", "reason": "Great refreshing option for the afternoon."}
]

Return ONLY the JSON array, no other text.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: prompt },
        ],
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

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "[]";
    
    // Parse the JSON from the response
    let recommendations;
    try {
      // Extract JSON array from response (handle markdown code blocks)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse recommendations:", content);
      recommendations = [];
    }

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Recommend error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
