import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, User, X, LogOut, Package, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="bg-foreground text-primary-foreground text-xs py-1.5">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="font-body">Free delivery in Nairobi for orders over KES 3,000</span>
          <span className="hidden sm:block font-body">📞 +254 703 739 265</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 gradient-brand rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground leading-tight">Mjini Collections</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-body font-medium">Shoes · Beauty · Style</p>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search shoes, beauty products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10 bg-secondary border-0 rounded-full font-body text-sm focus-visible:ring-primary" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] p-0 border-0">{itemCount}</Badge>
                )}
              </Button>
            </Link>
            {user ? (
              <div className="hidden sm:flex items-center gap-1">
                <Link to="/orders">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Package className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/account">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <UserCircle className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm">
                  <User className="w-4 h-4" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pb-1 animate-fade-in space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search products..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-10 bg-secondary border-0 rounded-full font-body" />
            </div>
            {user ? (
              <div className="space-y-1">
                <Link to="/orders" className="block">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm">
                    <Package className="w-4 h-4 mr-2" /> My Orders
                  </Button>
                </Link>
                <Link to="/account" className="block">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm">
                    <UserCircle className="w-4 h-4 mr-2" /> My Account
                  </Button>
                </Link>
                <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground font-body text-sm">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm">
                  <User className="w-4 h-4 mr-2" /> Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
