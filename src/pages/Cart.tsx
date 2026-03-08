import { Link } from "react-router-dom";
import PageTransition from "@/components/store/PageTransition";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { items, loading, itemCount, total, updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Your Bag ({itemCount})</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-body text-lg mb-2">Your bag is empty</p>
            <Link to="/">
              <Button className="gradient-brand text-primary-foreground rounded-xl font-body mt-4">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 bg-card rounded-xl p-4 border border-border">
                  <Link to={`/product/${item.product_id}`} className="shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-24 object-cover rounded-lg" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product_id}`} className="font-display font-semibold text-card-foreground text-sm hover:text-primary transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground font-body capitalize mt-0.5">{item.product.subcategory}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        {item.size && `Size: ${item.size}`}{item.size && item.color && " · "}{item.color && `Color: ${item.color}`}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-secondary"><Minus className="w-3 h-3" /></button>
                        <span className="px-3 text-sm font-body font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-secondary"><Plus className="w-3 h-3" /></button>
                      </div>
                      <span className="font-body font-bold text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive self-start p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex justify-between mb-2 text-sm font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm font-body">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-semibold">{total >= 3000 ? "Free" : formatPrice(300)}</span>
              </div>
              <div className="border-t border-border pt-4 flex justify-between font-body">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(total + (total >= 3000 ? 0 : 300))}</span>
              </div>
              <Link to="/checkout">
                <Button className="w-full gradient-brand text-primary-foreground rounded-xl font-body font-semibold mt-6 py-3">
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default Cart;
