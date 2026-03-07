import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border/10">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile: stacked, Desktop: row */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {/* Brand & Contact */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src={logo} alt="Mjini Collections" className="w-6 h-6 rounded object-cover" />
              <span className="font-bold text-foreground text-sm">Mjini</span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-3">
              <a href="tel:+254703739265" className="hover:text-primary transition-colors">+254 703 739 265</a>
              <a href="mailto:hello@mjinicollections.co.ke" className="hover:text-primary transition-colors break-all">hello@mjinicollections.co.ke</a>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://www.instagram.com/mjini_collection/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.tiktok.com/@mjinicollection?_r=1&_t=ZS-94Uw3Xodoqf" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="TikTok">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.64a6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 3.76.92V6.69Z"/></svg>
              </a>
              <a href="https://wa.me/254703739265" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="WhatsApp">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/mjinicollections" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Shop</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Heels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sneakers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Beauty</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Help</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li><Link to="/orders" className="hover:text-primary transition-colors">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="tel:+254703739265" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="col-span-2 md:col-span-1 pt-4 md:pt-0 border-t border-border/10 md:border-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
              © {new Date().getFullYear()} Mjini Collections
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">Made with 💕 in Kenya</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
