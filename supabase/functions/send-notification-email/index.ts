import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Mjini Collections <orders@mjinicollection.com>";

interface NotificationPayload {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    throw new Error(`Email send failed: ${err}`);
  }

  const data = await res.json();
  console.log("Email sent:", data.id);
  return data;
}

function buildEmailHtml(title: string, message: string, link?: string): string {
  const ctaButton = link
    ? `<a href="https://mjinicollection.com${link}" 
         style="display:inline-block;margin-top:20px;padding:12px 28px;background-color:#000;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
         View Details
       </a>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="margin:0;font-size:22px;font-weight:700;letter-spacing:1px;color:#111;">MJINI COLLECTION</h1>
    </div>

    <!-- Card -->
    <div style="background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <h2 style="margin:0 0 12px;font-size:18px;font-weight:600;color:#111;">${title}</h2>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">${message}</p>
      ${ctaButton}
    </div>

    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;font-size:12px;color:#999;line-height:1.5;">
      <p style="margin:0;">Mjini Collections &middot; Nairobi, Kenya</p>
      <p style="margin:4px 0 0;">
        <a href="https://mjinicollection.com" style="color:#999;text-decoration:underline;">mjinicollection.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: NotificationPayload = await req.json();
    const { user_id, title, message, type, link } = payload;

    if (!user_id || !title || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user email from Supabase auth
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(user_id);

    if (userError || !userData?.user?.email) {
      console.error("Could not fetch user email:", userError);
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = userData.user.email;

    // Build subject based on notification type
    const subjectMap: Record<string, string> = {
      order_update: `Order Update: ${title}`,
      admin_alert: `🔔 ${title}`,
      info: title,
    };
    const subject = subjectMap[type] || title;

    // Send the email
    const html = buildEmailHtml(title, message, link);
    await sendEmail(userEmail, subject, html);

    return new Response(
      JSON.stringify({ success: true, email: userEmail }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Email notification error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
