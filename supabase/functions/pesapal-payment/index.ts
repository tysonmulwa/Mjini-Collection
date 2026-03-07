import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PESAPAL_BASE_URL = "https://pay.pesapal.com/v3";

async function getPesapalToken(): Promise<string> {
  const consumerKey = Deno.env.get("PESAPAL_CONSUMER_KEY");
  const consumerSecret = Deno.env.get("PESAPAL_CONSUMER_SECRET");

  if (!consumerKey || !consumerSecret) {
    throw new Error("Pesapal credentials not configured");
  }

  const res = await fetch(`${PESAPAL_BASE_URL}/api/Auth/RequestToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Pesapal auth failed: ${JSON.stringify(data)}`);
  }

  return data.token;
}

async function registerIPN(token: string): Promise<string> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const ipnUrl = `${supabaseUrl}/functions/v1/pesapal-ipn`;

  const res = await fetch(`${PESAPAL_BASE_URL}/api/URLSetup/RegisterIPN`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      url: ipnUrl,
      ipn_notification_type: "GET",
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`IPN registration failed: ${JSON.stringify(data)}`);
  }

  return data.ipn_id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      userId,
      amount,
      phone,
      email,
      firstName,
      lastName,
      callbackUrl,
      deliveryAddress,
      deliveryCity,
      notes,
      items,
    } = await req.json();

    if (!userId || !amount || !phone || !items?.length) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create the order server-side using service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        total: amount,
        payment_method: "pesapal",
        delivery_address: deliveryAddress || null,
        delivery_city: deliveryCity || "Nairobi",
        phone,
        notes: notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation failed:", orderError);
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    // Insert order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      size: item.size || null,
      color: item.color || null,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      console.error("Order items creation failed:", itemsError);
      // Clean up the order
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }

    // Now initiate Pesapal payment
    const token = await getPesapalToken();
    const ipnId = await registerIPN(token);

    const orderRequest = {
      id: order.id,
      currency: "KES",
      amount,
      description: `Mjini Collections Order #${order.id.slice(0, 8)}`,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: email || "",
        phone_number: phone,
        first_name: firstName || "",
        last_name: lastName || "",
      },
    };

    const res = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderRequest),
      }
    );

    const data = await res.json();
    if (!res.ok || data.error) {
      const errorInfo = data?.error || data;
      const errorCode = errorInfo?.code || "";

      // Clean up order if payment initiation fails
      await supabase.from("order_items").delete().eq("order_id", order.id);
      await supabase.from("orders").delete().eq("id", order.id);

      if (errorCode === "amount_exceeds_default_limit") {
        return new Response(
          JSON.stringify({
            error: "This amount exceeds the online payment limit. Please use Cash on Delivery for this order, or try a smaller order.",
            code: "amount_limit",
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`Submit order failed: ${JSON.stringify(data)}`);
    }

    return new Response(
      JSON.stringify({
        redirect_url: data.redirect_url,
        order_tracking_id: data.order_tracking_id,
        merchant_reference: data.merchant_reference,
        orderId: order.id,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Pesapal payment error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
