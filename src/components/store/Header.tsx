import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, User, X, LogOut, Package, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="bg-accent text-accent-foreground/60 text-[10px] py-1.5 md:py-2 border-b border-border/10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <span className="font-body tracking-[0.1em] uppercase truncate">Free delivery in Nairobi over KES 3,000</span>
          <a href="tel:+254703739265" className="hidden sm:block font-body tracking-[0.1em] hover:text-primary transition-colors">+254 703 739 265</a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3">
            {/* Mobile menu toggle */}
            <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 min-h-[44px] min-w-[44px]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
              <img src={logo} alt="Mjini Collections" className="w-9 h-9 md:w-10 md:h-10 rounded object-cover" />
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
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 min-h-[44px] min-w-[44px] text-muted-foreground" onClick={() => setSearchOpen(!searchOpen)}>
                <Search className="w-4 h-4" />
              </Button>

              <ThemeToggle />

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative h-10 w-10 min-h-[44px] min-w-[44px] text-muted-foreground hover:text-primary transition-colors">
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
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary">
                      <Package className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/account">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary">
                      <UserCircle className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm h-10">
                    <User className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10 bg-secondary/50 border border-border rounded-none font-body h-11"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="md:hidden overflow-hidden"
              >
                <div className="pt-3 pb-1">
                  <nav className="bg-card border border-border p-2 space-y-0.5">
                    {user ? (
                      <>
                        <Link to="/orders" className="block" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                            <Package className="w-4 h-4 mr-2.5" /> My Orders
                          </Button>
                        </Link>
                        <Link to="/account" className="block" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                            <UserCircle className="w-4 h-4 mr-2.5" /> My Account
                          </Button>
                        </Link>
                        <Button variant="ghost" onClick={() => { signOut(); setMobileMenuOpen(false); }} className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                          <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                          <User className="w-4 h-4 mr-2.5" /> Sign In
                        </Button>
                      </Link>
                    )}
                  </nav>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
