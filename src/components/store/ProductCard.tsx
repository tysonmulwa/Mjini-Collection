import { Heart, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

export interface Product {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  isNew: boolean;
  onSale: boolean;
  description: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(false);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const discount = product.onSale
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!product.inStock) return;
    onAddToCart(product.id);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <Card className="group border-0 shadow-none hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden bg-card animate-fade-in">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <Badge className="bg-primary text-primary-foreground border-0 text-[10px] font-body font-semibold uppercase tracking-wider px-2.5 py-0.5">
              New
            </Badge>
          )}
          {product.onSale && (
            <Badge className="bg-accent text-accent-foreground border-0 text-[10px] font-body font-semibold px-2.5 py-0.5">
              -{discount}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge className="bg-muted text-muted-foreground border-0 text-[10px] font-body font-semibold px-2.5 py-0.5">
              Sold Out
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/70 backdrop-blur-sm hover:bg-card shadow-sm"
        >
          <Heart className={`w-4 h-4 transition-colors ${wishlisted ? "fill-accent text-accent" : "text-foreground"}`} />
        </Button>

        {/* Quick add - appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full gradient-brand text-primary-foreground rounded-xl font-body font-semibold text-sm py-2.5 shadow-lg"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            {product.inStock ? "Add to Bag" : "Sold Out"}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-body font-medium mb-1">
          {product.subcategory}
        </p>
        <h3 className="font-display font-semibold text-card-foreground text-sm mb-2 leading-snug group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
          <span className="text-xs font-body font-medium text-card-foreground">{product.rating}</span>
          <span className="text-xs text-muted-foreground font-body">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-body font-bold text-card-foreground">
            {formatPrice(product.price)}
          </span>
          {product.onSale && (
            <span className="text-xs text-muted-foreground line-through font-body">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
