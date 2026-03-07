import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, User, X, LogOut, Package, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-accent text-accent-foreground/60 text-[10px] py-2 border-b border-border/10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="font-body tracking-[0.1em] uppercase">Free delivery in Nairobi over KES 3,000</span>
          <span className="hidden sm:block font-body tracking-[0.1em]">+254 703 739 265</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Mobile menu toggle */}
            <Button variant="ghost" size="icon" className="md:hidden h-9 w-9" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 bg-accent flex items-center justify-center border border-primary/30">
                <span className="text-primary font-display font-bold text-xl">M</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-display font-bold text-foreground leading-none tracking-wide">Mjini</h1>
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-body mt-0.5">Collections</p>
              </div>
            </Link>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-11 pr-4 h-11 bg-secondary/50 border border-border rounded-none font-body text-sm focus-visible:ring-1 focus-visible:ring-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 text-muted-foreground" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="w-4 h-4" />
              </Button>

              <ThemeToggle />

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-9 w-9 text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold font-body">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-0.5">
                  <Link to="/orders">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                      <Package className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/account">
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                      <UserCircle className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm h-9">
                    <User className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile search */}
          {searchOpen && (
            <div className="md:hidden mt-3 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-secondary/50 border border-border rounded-none font-body h-10"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-2 animate-fade-in">
              <div className="bg-card border border-border p-3 space-y-1">
                {user ? (
                  <>
                    <Link to="/orders" className="block">
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-10">
                        <Package className="w-4 h-4 mr-2.5" /> My Orders
                      </Button>
                    </Link>
                    <Link to="/account" className="block">
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-10">
                        <UserCircle className="w-4 h-4 mr-2.5" /> My Account
                      </Button>
                    </Link>
                    <Button variant="ghost" onClick={signOut} className="w-full justify-start text-muted-foreground font-body text-sm h-10">
                      <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/login" className="block">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-10">
                      <User className="w-4 h-4 mr-2.5" /> Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
