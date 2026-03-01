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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Pesapal sends IPN as GET with query params
    const url = new URL(req.url);
    const orderTrackingId = url.searchParams.get("OrderTrackingId");
    const orderMerchantReference = url.searchParams.get("OrderMerchantReference");
    const orderNotificationType = url.searchParams.get("OrderNotificationType");

    if (!orderTrackingId || !orderMerchantReference) {
      return new Response(
        JSON.stringify({ error: "Missing IPN parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get transaction status from Pesapal
    const token = await getPesapalToken();
    const statusRes = await fetch(
      `${PESAPAL_BASE_URL}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const statusData = await statusRes.json();
    console.log("Pesapal transaction status:", JSON.stringify(statusData));

    // Map Pesapal status to our order status
    // status_code: 0 = Invalid, 1 = Completed, 2 = Failed, 3 = Reversed
    let orderStatus = "pending";
    if (statusData.payment_status_description === "Completed" || statusData.status_code === 1) {
      orderStatus = "confirmed";
    } else if (statusData.status_code === 2) {
      orderStatus = "cancelled";
    } else if (statusData.status_code === 3) {
      orderStatus = "cancelled";
    }

    // Update order in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        payment_method: `pesapal:${orderTrackingId}`,
      })
      .eq("id", orderMerchantReference);

    if (error) {
      console.error("Failed to update order:", error);
      throw new Error(`DB update failed: ${error.message}`);
    }

    console.log(`Order ${orderMerchantReference} updated to ${orderStatus}`);

    return new Response(
      JSON.stringify({
        orderNotificationType,
        orderTrackingId,
        orderMerchantReference,
        status: orderStatus,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Pesapal IPN error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
