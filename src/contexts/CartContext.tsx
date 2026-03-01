import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number;
    image: string;
    in_stock: boolean | null;
    category: string;
    subcategory: string;
  };
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  total: number;
  addItem: (productId: string, quantity?: number, size?: string, color?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("cart_items")
      .select("id, product_id, quantity, size, color, products(id, name, price, original_price, image, in_stock, category, subcategory)")
      .eq("user_id", user.id);

    if (!error && data) {
      setItems(data.map((item: any) => ({ ...item, product: item.products })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addItem = async (productId: string, quantity = 1, size?: string, color?: string) => {
    if (!user) { toast.error("Please sign in to add items to cart"); return; }
    const existing = items.find(i => i.product_id === productId && i.size === (size || null) && i.color === (color || null));
    if (existing) {
      await updateQuantity(existing.id, existing.quantity + quantity);
      return;
    }
    const { error } = await supabase.from("cart_items").insert({
      user_id: user.id, product_id: productId, quantity, size: size || null, color: color || null,
    });
    if (error) { toast.error("Failed to add item"); return; }
    toast.success("Added to cart");
    await fetchCart();
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) { await removeItem(itemId); return; }
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    await fetchCart();
  };

  const removeItem = async (itemId: string) => {
    await supabase.from("cart_items").delete().eq("id", itemId);
    toast.success("Removed from cart");
    await fetchCart();
  };

  const clearCart = async () => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    setItems([]);
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, itemCount, total, addItem, updateQuantity, removeItem, clearCart, refresh: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
