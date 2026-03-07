import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const PaymentCallback = () => {
  const { clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const orderId = searchParams.get("OrderMerchantReference");

  useEffect(() => {
    if (!orderId) {
      setStatus("failed");
      return;
    }

    // Initial fetch
    const fetchOrder = async () => {
      const { data } = await supabase
        .from("orders")
        .select("status")
        .eq("id", orderId)
        .single();
      if (data) {
        setOrderStatus(data.status);
        if (data.status === "confirmed") {
          setStatus("success");
          clearCart();
        }
      }
    };
    fetchOrder();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const newStatus = payload.new.status;
          setOrderStatus(newStatus);
          if (newStatus === "confirmed") {
            setStatus("success");
            clearCart();
          } else if (newStatus === "cancelled") {
            setStatus("failed");
          }
        }
      )
      .subscribe();

    // Timeout fallback — show success after 20s since order exists
    const timeout = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "success" : prev));
    }, 20000);

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(timeout);
    };
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
          <h1 className="text-xl font-display font-bold text-foreground mb-2">Confirming Payment...</h1>
          <p className="text-muted-foreground font-body mb-2">Please wait while we verify your payment.</p>
          <Badge variant="outline" className="font-body text-xs">Status: {orderStatus}</Badge>
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
