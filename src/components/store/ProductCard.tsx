import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface ProductCardProps {
  product: Tables<"products">;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  const discount = product.on_sale ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please sign in to add items"); return; }
    await addItem(product.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error("Please sign in to save items"); return; }
    await toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Link to={`/product/${product.id}`} className="block group">
      <div className="relative bg-card overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary/30">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground border-0 text-[9px] font-body font-semibold uppercase tracking-[0.15em] px-3 py-1 rounded-none">
                New
              </Badge>
            )}
            {product.on_sale && (
              <Badge className="bg-accent text-accent-foreground border-0 text-[9px] font-body font-semibold px-3 py-1 rounded-none">
                -{discount}%
              </Badge>
            )}
            {!product.in_stock && (
              <Badge className="bg-muted text-muted-foreground border-0 text-[9px] font-body font-semibold px-3 py-1 rounded-none">
                Sold Out
              </Badge>
            )}
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-9 h-9 bg-card/90 backdrop-blur-sm hover:bg-card border border-border/30 rounded-none hover:scale-105 transition-all duration-300"
          >
            <Heart className={`w-4 h-4 transition-all duration-300 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
          </Button>

          {/* Add to cart */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full gradient-brand text-primary-foreground rounded-none font-body font-semibold text-xs tracking-wider uppercase h-10"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.in_stock ? "Add to Bag" : "Sold Out"}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-body font-medium mb-1.5">{product.subcategory}</p>
          <h3 className="font-display font-semibold text-card-foreground text-sm mb-2.5 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-muted-foreground font-body">({product.review_count})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-display font-bold text-card-foreground">{formatPrice(product.price)}</span>
            {product.on_sale && (
              <span className="text-xs text-muted-foreground line-through font-body">{formatPrice(product.original_price)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
