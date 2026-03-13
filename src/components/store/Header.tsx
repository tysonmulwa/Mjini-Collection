import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, User, X, LogOut, Package, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import logo from "@/assets/logo.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useStoreSettings } from "@/hooks/useStoreSettings";
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
  const { delivery, storeInfo } = useStoreSettings();

  return (
    <header className="sticky top-0 z-50">
      {/* Top bar */}
      <div className="text-[10px] py-1.5 md:py-2 border-b border-border/10 bg-secondary text-primary">
        <div className="container mx-auto px-4 flex-row flex items-start justify-between">
          <span className="font-body tracking-[0.1em] uppercase truncate font-serif font-bold text-center">
            {delivery.free_threshold > 0
              ? `   Free delivery in Nairobi for orders over KES ${delivery.free_threshold.toLocaleString()}`
              : "   Fast delivery across Nairobi"}
          </span>
          <a href={`tel:${storeInfo.phone.replace(/\s/g, "")}`} className="hidden sm:block font-body tracking-[0.1em] hover:text-primary transition-colors">{storeInfo.phone}</a>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4 bg-secondary">
          <div className="flex-row flex items-center justify-between gap-0 rounded-full">
            {/* Logo — always left */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group order-first">
              <img alt="Mjini Collections" className="w-9 h-9 md:w-10 md:h-10 dark:brightness-110 dark:contrast-105 rounded-full object-cover" src="/brand-assets/d4616573-83a0-4261-bead-c55f80c3751a.jpg" />
              <div>
                <h1 className="text-lg font-display font-bold text-foreground leading-none tracking-wide my-0 py-0 text-center">Mjini Collection </h1>
                <p className="hidden sm:block text-[9px] uppercase tracking-[0.3em] text-muted-foreground font-body mt-0.5 my-0">​</p>
              </div>
            </Link>

            {/* Mobile menu toggle */}
            <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 min-h-[44px] min-w-[44px] ml-auto" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-[20px]" /> : <Menu className="w-5 h-5" />}
            </Button>

            {/* Desktop search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-11 pr-4 h-11 bg-secondary/50 border border-border rounded-none font-body text-sm focus-visible:ring-1 focus-visible:ring-primary/40 transition-all" />
                
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
                  {itemCount > 0 &&
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold font-body">
                      {itemCount}
                    </span>
                  }
                </Button>
              </Link>

              {user ?
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
                </div> :

              <Link to="/login">
                  <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-muted-foreground hover:text-foreground font-body text-sm h-10">
                    <User className="w-4 h-4" /> Sign In
                  </Button>
                </Link>
              }
            </div>
          </div>

          {/* Mobile search */}
          <AnimatePresence>
            {searchOpen &&
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="md:hidden overflow-hidden">
              
                <div className="pt-3">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-secondary/50 border border-border rounded-none font-body h-11"
                    autoFocus />
                  
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen &&
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="md:hidden overflow-hidden">
              
                <div className="pt-3 pb-1">
                  <nav className="bg-card border border-border p-2 space-y-0.5">
                    {user ?
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
                        <Button variant="ghost" onClick={() => {signOut();setMobileMenuOpen(false);}} className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                          <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
                        </Button>
                      </> :

                  <Link to="/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-muted-foreground font-body text-sm h-11 min-h-[44px]">
                          <User className="w-4 h-4 mr-2.5" /> Sign In
                        </Button>
                      </Link>
                  }
                  </nav>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </header>);

};

export default Header;