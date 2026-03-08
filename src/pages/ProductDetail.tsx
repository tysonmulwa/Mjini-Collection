import { useEffect, useState } from "react";
import PageTransition from "@/components/store/PageTransition";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, ShoppingBag, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Tables<"products"> | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
      if (error || !data) { navigate("/"); return; }
      setProduct(data);
      if (data.sizes?.length) setSelectedSize(data.sizes[0]);
      if (data.colors?.length) setSelectedColor(data.colors[0]);

      // Load gallery images from storage
      const { data: files } = await supabase.storage
        .from("product-images")
        .list(`${id}`, { limit: 10, sortBy: { column: "name", order: "asc" } });

      if (files && files.length > 0) {
        const urls = files
          .filter(f => !f.name.startsWith("."))
          .map(f => supabase.storage.from("product-images").getPublicUrl(`${id}/${f.name}`).data.publicUrl);
        setImages([data.image, ...urls]);
      } else {
        setImages([data.image]);
      }

      setLoading(false);
    };
    fetchProduct();
  }, [id, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;
  const discount = product.on_sale ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = async () => {
    await addItem(product.id, quantity, selectedSize || undefined, selectedColor || undefined);
  };

  const handleWishlist = async () => {
    if (!user) { toast.error("Please sign in to save items"); return; }
    await toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.is_new && <Badge className="bg-primary text-primary-foreground border-0 font-body text-xs">New</Badge>}
                {product.on_sale && <Badge className="bg-accent text-accent-foreground border-0 font-body text-xs">-{discount}%</Badge>}
                {!product.in_stock && <Badge className="bg-muted text-muted-foreground border-0 font-body text-xs">Sold Out</Badge>}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body mb-2">{product.subcategory}</p>
            <h1 className="text-3xl font-display font-bold text-foreground mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
              <span className="text-sm font-body font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground font-body">({product.review_count} reviews)</span>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-body font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.on_sale && <span className="text-lg text-muted-foreground line-through font-body">{formatPrice(product.original_price)}</span>}
            </div>

            <p className="text-muted-foreground font-body text-sm mb-6 leading-relaxed">{product.description}</p>

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-body font-semibold text-foreground mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-body transition-all ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-body font-semibold text-foreground mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border text-sm font-body transition-all ${selectedColor === color ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground hover:border-primary"}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="text-sm font-body font-semibold text-foreground">Quantity</p>
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-body font-medium text-sm">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleAddToCart} disabled={!product.in_stock} className="flex-1 gradient-brand text-primary-foreground rounded-xl font-body font-semibold py-3">
                <ShoppingBag className="w-4 h-4 mr-2" />
                {product.in_stock ? "Add to Bag" : "Sold Out"}
              </Button>
              <Button variant="outline" size="icon" onClick={handleWishlist} className="rounded-xl border-border w-12 h-12">
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? "fill-accent text-accent" : ""}`} />
              </Button>
            </div>

            {/* Info */}
            <div className="mt-8 space-y-3 text-sm font-body text-muted-foreground">
              <p>🚚 Free delivery in Nairobi for orders over KES 3,000</p>
              <p>💳 Pay via M-Pesa or Cash on Delivery</p>
              <p>🔄 30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
