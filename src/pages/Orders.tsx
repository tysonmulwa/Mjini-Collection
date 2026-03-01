import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string | null;
  color: string | null;
  products: { name: string; image: string } | null;
}

interface Order {
  id: string;
  status: string;
  total: number;
  payment_method: string;
  delivery_address: string | null;
  delivery_city: string | null;
  phone: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmed", class: "bg-blue-100 text-blue-800" },
  shipped: { label: "Shipped", class: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", class: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", class: "bg-red-100 text-red-800" },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*, order_items(*, products(name, image))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setOrders(data as unknown as Order[]);
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Please sign in to view your orders</p>
          <Link to="/login"><Button className="gradient-brand text-primary-foreground rounded-xl font-body">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg mb-2">No orders yet</p>
            <Link to="/"><Button className="gradient-brand text-primary-foreground rounded-xl font-body mt-4">Start Shopping</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const expanded = expandedOrder === order.id;
              const status = statusConfig[order.status] || statusConfig.pending;
              return (
                <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(expanded ? null : order.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                        <Badge className={`${status.class} text-xs border-0`}>{status.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-body">
                        <span className="text-muted-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</span>
                        <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                        <span className="text-muted-foreground text-xs">{order.order_items.length} item{order.order_items.length !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>

                  {expanded && (
                    <div className="border-t border-border p-4 space-y-3 animate-fade-in">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <img src={item.products?.image || "/placeholder.svg"} alt={item.products?.name || ""} className="w-12 h-14 object-cover rounded-lg bg-muted" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-body font-medium text-foreground truncate">{item.products?.name}</p>
                            <p className="text-xs text-muted-foreground font-body">
                              Qty: {item.quantity}
                              {item.size && ` · Size: ${item.size}`}
                              {item.color && ` · ${item.color}`}
                            </p>
                          </div>
                          <span className="text-sm font-body font-semibold">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-3 text-xs font-body text-muted-foreground space-y-1">
                        <p>📍 {order.delivery_address || "—"}, {order.delivery_city || "Nairobi"}</p>
                        <p>📞 {order.phone || "—"}</p>
                        <p>💳 {order.payment_method === "cod" ? "Cash on Delivery" : "M-Pesa"}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
