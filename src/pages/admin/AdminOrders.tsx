import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Package } from "lucide-react";

type Order = Tables<"orders">;
type OrderItem = Tables<"order_items"> & { product?: { name: string; image: string } | null };

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});
  const [loadingItems, setLoadingItems] = useState<string | null>(null);

  const fetchOrders = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const toggleOrder = async (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);
    if (orderItems[orderId]) return;

    setLoadingItems(orderId);
    const { data } = await supabase
      .from("order_items")
      .select("*, product:products(name, image)")
      .eq("order_id", orderId);
    if (data) {
      setOrderItems((prev) => ({ ...prev, [orderId]: data as OrderItem[] }));
    }
    setLoadingItems(null);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Order status updated to ${status}`);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Orders</h1>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead className="hidden md:table-cell">City</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <>
                <TableRow key={order.id} className="cursor-pointer" onClick={() => toggleOrder(order.id)}>
                  <TableCell className="w-10 pr-0">
                    {expandedOrder === order.id ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">{order.id.slice(0, 8)}...</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm font-medium">KES {order.total.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm capitalize text-muted-foreground">{order.payment_method === "cod" ? "Cash on Delivery" : "M-Pesa"}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{order.delivery_city || "—"}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                      <SelectTrigger className="w-32 h-8">
                        <Badge className={`${statusColors[order.status] || "bg-muted text-muted-foreground"} text-xs border-0`}>
                          {order.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
                {expandedOrder === order.id && (
                  <TableRow key={`${order.id}-items`}>
                    <TableCell colSpan={7} className="bg-muted/30 p-0">
                      <div className="px-6 py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="w-4 h-4 text-primary" />
                          <span className="text-sm font-semibold text-foreground">Items Ordered</span>
                        </div>
                        {order.phone && (
                          <p className="text-xs text-muted-foreground mb-2">Phone: {order.phone}</p>
                        )}
                        {order.delivery_address && (
                          <p className="text-xs text-muted-foreground mb-3">Address: {order.delivery_address}</p>
                        )}
                        {loadingItems === order.id ? (
                          <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(orderItems[order.id] || []).map((item) => (
                              <div key={item.id} className="flex items-center gap-3 bg-card rounded-lg border border-border p-3">
                                {item.product?.image && (
                                  <img src={item.product.image} alt={item.product?.name || ""} className="w-12 h-12 rounded-md object-cover" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{item.product?.name || "Unknown Product"}</p>
                                  <div className="flex gap-3 text-xs text-muted-foreground mt-0.5">
                                    <span>Qty: {item.quantity}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.color && <span>Color: {item.color}</span>}
                                  </div>
                                </div>
                                <p className="text-sm font-medium text-foreground whitespace-nowrap">KES {item.price.toLocaleString()}</p>
                              </div>
                            ))}
                            {(orderItems[order.id] || []).length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-2">No items found</p>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
            {orders.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No orders yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminOrders;
