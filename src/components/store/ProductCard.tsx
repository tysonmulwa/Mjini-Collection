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
  const discount = product.on_sale ? Math.round((product.original_price - product.price) / product.original_price * 100) : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {toast.error("Please sign in to add items");return;}
    await addItem(product.id);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {toast.error("Please sign in to save items");return;}
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
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5">
            {product.is_new &&
            <Badge className="bg-primary text-primary-foreground border-0 text-[8px] md:text-[9px] font-body font-semibold uppercase tracking-[0.15em] px-2 md:px-3 py-0.5 md:py-1 rounded-none">
                New
              </Badge>
            }
            {product.on_sale &&
            <Badge className="bg-accent text-accent-foreground border-0 text-[8px] md:text-[9px] font-body font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-none">
                -{discount}%
              </Badge>
            }
            {!product.in_stock &&
            <Badge className="bg-muted text-muted-foreground border-0 text-[8px] md:text-[9px] font-body font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-none">
                Sold Out
              </Badge>
            }
          </div>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlist}
            className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-9 md:h-9 min-h-[44px] min-w-[44px] backdrop-blur-sm border border-border/30 transition-all duration-300 rounded-full bg-secondary">
            
            <Heart className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-all duration-300 ${wishlisted ? "fill-primary text-primary" : "text-foreground"}`} />
          </Button>

          {/* Add to cart — hidden on mobile, shown on hover for desktop */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 hidden md:block">
            <Button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="w-full gradient-brand text-primary-foreground rounded-none font-body font-semibold text-xs tracking-wider uppercase h-10">
              
              <ShoppingBag className="w-4 h-4 mr-2" />
              {product.in_stock ? "Add to Bag" : "Sold Out"}
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 md:p-4 rounded-none px-0 py-0">
          <p className="md:text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-body mb-1 md:mb-1.5 text-sm font-sans font-bold text-center">{product.subcategory}</p>
          <h3 className="font-display font-semibold text-card-foreground md:text-sm mb-2 md:mb-2.5 leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2 md:line-clamp-1 text-sm font-serif text-center">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2 md:mb-3">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) =>
              <Star
                key={i}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                i < Math.floor(product.rating || 0) ?
                "fill-primary text-primary" :
                "fill-muted text-muted"}`
                } />

              )}
            </div>
            <span className="text-[9px] md:text-[10px] text-muted-foreground font-body">({product.review_count})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-display font-bold text-card-foreground">{formatPrice(product.price)}</span>
            {product.on_sale &&
            <span className="text-[10px] md:text-xs text-muted-foreground line-through font-body">{formatPrice(product.original_price)}</span>
            }
          </div>

          {/* Mobile add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            size="sm"
            className="w-full mt-2.5 md:hidden gradient-brand text-primary-foreground rounded-none font-body font-semibold text-[11px] tracking-wider uppercase h-9 min-h-[40px]">
            
            <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
            {product.in_stock ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>
      </div>
    </Link>);

};

export default ProductCard;