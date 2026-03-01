import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlistIds: Set<string>;
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: new Set(),
  toggleWishlist: async () => {},
  isWishlisted: () => false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) { setWishlistIds(new Set()); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);
      if (data) setWishlistIds(new Set(data.map((w: any) => w.product_id)));
    };
    fetch();
  }, [user]);

  const isWishlisted = useCallback((id: string) => wishlistIds.has(id), [wishlistIds]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user) return;
    if (wishlistIds.has(productId)) {
      await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_id", productId);
      setWishlistIds(prev => { const n = new Set(prev); n.delete(productId); return n; });
    } else {
      await supabase.from("wishlists").insert({ user_id: user.id, product_id: productId });
      setWishlistIds(prev => new Set(prev).add(productId));
    }
  }, [user, wishlistIds]);

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
