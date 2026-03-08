import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBag, DollarSign, Users } from "lucide-react";
import { DeliveryFeeSettings, StoreInfoSettings } from "@/components/admin/DeliveryFeeSettings";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("*"),
      ]);

      const orders = ordersRes.data || [];
      const revenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pending = orders.filter((o) => o.status === "pending").length;

      setStats({
        products: productsRes.count || 0,
        orders: orders.length,
        revenue,
        pending,
      });
    };
    fetchStats();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.products, icon: Package, color: "text-primary" },
    { label: "Total Orders", value: stats.orders, icon: ShoppingBag, color: "text-accent" },
    { label: "Revenue", value: `KES ${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-primary" },
    { label: "Pending Orders", value: stats.pending, icon: Users, color: "text-accent" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Card key={card.label} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold text-foreground">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DeliveryFeeSettings />
        <StoreInfoSettings />
      </div>
    </div>
  );
};

export default AdminDashboard;
