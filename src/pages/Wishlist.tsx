import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import PageTransition from "@/components/store/PageTransition";
import ProductCard from "@/components/store/ProductCard";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { Heart } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const Wishlist = () => {
  const { user, loading: authLoading } = useAuth();
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (!user || wishlistIds.size === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const ids = Array.from(wishlistIds);
      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", ids);
      setProducts(data || []);
      setLoading(false);
    };
    if (!authLoading) fetchWishlistProducts();
  }, [user, wishlistIds, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
      <Header searchQuery="" onSearchChange={() => {}} />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary" />
            My Wishlist
          </h1>

          {!user ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body mb-4">Please sign in to view your wishlist</p>
              <Link to="/login" className="text-primary font-body font-semibold hover:underline">
                Sign In
              </Link>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-body mb-4">Your wishlist is empty</p>
              <Link to="/" className="text-primary font-body font-semibold hover:underline">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
};

export default Wishlist;
