import { useState } from "react";
import PageTransition from "@/components/store/PageTransition";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useDeliveryFee } from "@/hooks/useDeliveryFee";

const Checkout = () => {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");
  const [form, setForm] = useState({
    phone: "",
    address: "",
    city: "Nairobi",
    notes: "",
    paymentMethod: "pesapal" as "cod" | "pesapal",
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Please sign in to checkout</p>
          <Link to="/login"><Button className="gradient-brand text-primary-foreground rounded-xl font-body">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Your cart is empty</p>
          <Link to="/"><Button className="gradient-brand text-primary-foreground rounded-xl font-body">Shop Now</Button></Link>
        </div>
      </div>
    );
  }

  const deliveryFee = total >= 3000 ? 0 : 300;
  const grandTotal = total + deliveryFee;
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone || !form.address) { toast.error("Please fill in delivery details"); return; }
    setLoading(true);

    if (form.paymentMethod === "pesapal") {
      // For Pesapal: order is created server-side in the edge function
      try {
        const callbackUrl = `${window.location.origin}/payment-callback`;
        const cartItems = items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
          size: item.size,
          color: item.color,
        }));

        const { data: pesapalData, error: pesapalError } = await supabase.functions.invoke("pesapal-payment", {
          body: {
            userId: user.id,
            amount: grandTotal,
            phone: form.phone,
            email: user.email,
            firstName: user.user_metadata?.full_name?.split(" ")[0] || "",
            lastName: user.user_metadata?.full_name?.split(" ").slice(1).join(" ") || "",
            callbackUrl,
            deliveryAddress: form.address,
            deliveryCity: form.city,
            notes: form.notes,
            items: cartItems,
          },
        });

        if (pesapalError || !pesapalData?.redirect_url) {
          // Parse error from either pesapalData or pesapalError
          const errorData = pesapalData || (pesapalError as any)?.context?.body;
          const isAmountLimit = errorData?.code === "amount_limit" || 
            (typeof pesapalError === "object" && JSON.stringify(pesapalError).includes("amount_limit"));
          const msg = isAmountLimit
            ? "This amount exceeds the online payment limit. Please use Cash on Delivery."
            : "Failed to initiate payment. Try Cash on Delivery.";
          toast.error(msg);
          setLoading(false);
          return;
        }

        // Don't clear cart yet — only clear after successful payment confirmation
        window.location.href = pesapalData.redirect_url;
        return;
      } catch (err) {
        console.error("Pesapal error:", err);
        toast.error("Payment service unavailable. Try Cash on Delivery.");
        setLoading(false);
        return;
      }
    }

    // Cash on delivery flow — create order client-side
    const { data: order, error: orderError } = await supabase.from("orders").insert({
      user_id: user.id,
      total: grandTotal,
      payment_method: "cod",
      delivery_address: form.address,
      delivery_city: form.city,
      phone: form.phone,
      notes: form.notes,
    }).select().single();

    if (orderError || !order) { toast.error("Failed to place order"); setLoading(false); return; }

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
      size: item.size,
      color: item.color,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) { toast.error("Failed to save order items"); setLoading(false); return; }

    const orderSummary = items.map(i => `${i.product.name} x${i.quantity}`).join(", ");
    const whatsappMsg = encodeURIComponent(
      `🛍️ *Order Confirmation - Mjini Collections*\n\n` +
      `Order #${order.id.slice(0, 8)}\n` +
      `Items: ${orderSummary}\n` +
      `Total: KES ${grandTotal.toLocaleString()}\n` +
      `Payment: Cash on Delivery\n` +
      `📍 ${form.address}, ${form.city}\n` +
      `📞 ${form.phone}\n\n` +
      `Thank you for your order! We'll process it shortly.`
    );
    const storePhone = "254703739265";
    const whatsappUrl = `https://wa.me/${storePhone}?text=${whatsappMsg}`;

    await clearCart();
    setWhatsappLink(whatsappUrl);
    setSuccess(true);
    setLoading(false);
    toast.success("Order placed successfully!");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">Order Placed!</h1>
          <p className="text-muted-foreground font-body mb-6">Thank you for shopping with Mjini Collections. We'll contact you on {form.phone} with delivery updates.</p>
          <div className="flex flex-col gap-3">
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl font-body">
                📲 Confirm on WhatsApp
              </Button>
            </a>
            <Link to="/orders"><Button variant="outline" className="w-full rounded-xl font-body">View My Orders</Button></Link>
            <Link to="/"><Button variant="outline" className="w-full rounded-xl font-body">Continue Shopping</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to bag
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Checkout</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Details */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h2 className="font-display font-semibold text-foreground">Delivery Details</h2>
            <div>
              <Label className="font-body text-sm">Phone Number</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+254 7XX XXX XXX" className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Delivery Address</Label>
              <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required placeholder="Street, building, apartment" className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">City</Label>
              <Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Notes (optional)</Label>
              <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Delivery instructions" className="font-body mt-1" />
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-3">
            <h2 className="font-display font-semibold text-foreground">Payment Method</h2>
            
            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.paymentMethod === "pesapal" ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="radio" name="payment" checked={form.paymentMethod === "pesapal"} onChange={() => setForm({ ...form, paymentMethod: "pesapal" })} className="accent-[hsl(var(--primary))]" />
              <div>
                <p className="font-body font-medium text-sm text-foreground">Pay Online (Pesapal)</p>
                <p className="font-body text-xs text-muted-foreground">M-Pesa, Visa, Mastercard, Airtel Money</p>
              </div>
            </label>

            <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${form.paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"}`}>
              <input type="radio" name="payment" checked={form.paymentMethod === "cod"} onChange={() => setForm({ ...form, paymentMethod: "cod" })} className="accent-[hsl(var(--primary))]" />
              <div>
                <p className="font-body font-medium text-sm text-foreground">Cash on Delivery</p>
                <p className="font-body text-xs text-muted-foreground">Pay when your order arrives</p>
              </div>
            </label>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-foreground mb-4">Order Summary</h2>
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm font-body py-1">
                <span className="text-muted-foreground">{item.product.name} × {item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm font-body">
              <span className="text-muted-foreground">Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}</span>
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-body">
              <span className="font-semibold">Total</span>
              <span className="text-lg font-bold">{formatPrice(grandTotal)}</span>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full gradient-brand text-primary-foreground rounded-xl font-body font-semibold py-3 text-base">
            {loading ? (
              <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>
            ) : form.paymentMethod === "pesapal" ? (
              `Pay ${formatPrice(grandTotal)}`
            ) : (
              `Place Order · ${formatPrice(grandTotal)}`
            )}
          </Button>
        </form>
      </div>
    </div>
    </PageTransition>
  );
};

export default Checkout;
