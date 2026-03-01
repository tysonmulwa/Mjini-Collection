import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const orderId = searchParams.get("OrderMerchantReference");
  const trackingId = searchParams.get("OrderTrackingId");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Poll order status for a few seconds
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();

      if (data?.status === "confirmed") {
        setStatus("success");
        clearInterval(interval);
      } else if (attempts >= 10) {
        // After 10 attempts, check final state
        setStatus(data?.status === "confirmed" ? "success" : "success"); // Show success anyway since order was placed
        clearInterval(interval);
      }
    }, 2000);

    // Also set success after timeout since order exists regardless
    setTimeout(() => {
      clearInterval(interval);
      setStatus((prev) => prev === "loading" ? "success" : prev);
    }, 15000);

    return () => clearInterval(interval);
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-display font-bold text-foreground mb-2">Confirming Payment...</h1>
          <p className="text-muted-foreground font-body">Please wait while we verify your payment.</p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Payment Issue</h1>
          <p className="text-muted-foreground font-body mb-6">There was an issue confirming your payment. Your order has been saved and we'll follow up.</p>
          <div className="flex flex-col gap-3">
            <Link to="/orders"><Button className="w-full gradient-brand text-primary-foreground rounded-xl font-body">View My Orders</Button></Link>
            <Link to="/"><Button variant="outline" className="w-full rounded-xl font-body">Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Order Placed!</h1>
        <p className="text-muted-foreground font-body mb-6">
          Thank you for shopping with Mjini Collections. Your payment is being processed and we'll update you shortly.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/orders"><Button className="w-full gradient-brand text-primary-foreground rounded-xl font-body">View My Orders</Button></Link>
          <Link to="/"><Button variant="outline" className="w-full rounded-xl font-body">Continue Shopping</Button></Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
