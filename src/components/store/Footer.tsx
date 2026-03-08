import { Link } from "react-router-dom";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border/10">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-8">
          {/* Brand & Contact */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3 flex-row flex items-center justify-start gap-[5px]">
              <img src={logo} alt="Mjini Collections" className="w-6 h-6 rounded object-cover" />
              <span className="font-bold text-foreground text-sm">Mjini Collection </span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground mb-3">
              <a href="tel:+254703739265" className="hover:text-primary transition-colors min-h-[44px] flex items-center md:min-h-0 text-sm text-left rounded-3xl">+254 703 739 265</a>
              <a className="hover:text-primary transition-colors break-all" href="mailto:contact@mjinicollection.com">​contact@mjinicollection.com</a>
            </div>
            <div className="flex-row flex items-center justify-start gap-[30px] rounded-xl">
              <a href="https://www.instagram.com/mjini_collection?igsh=dm1rYnF6dnVqdjJi&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1.5 -m-1.5 rounded-full" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@mjinicollection?_r=1&_t=ZS-94Uw3Xodoqf" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1.5 -m-1.5 rounded-full" aria-label="TikTok">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1v-3.5a6.37 6.37 0 0 0-.8-.05A6.34 6.34 0 0 0 3.15 15.3 6.34 6.34 0 0 0 9.49 21.64a6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 3.76.92V6.69Z" /></svg>
              </a>
              <a href="https://wa.me/254703739265" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1.5 -m-1.5 rounded-full" aria-label="WhatsApp">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://www.facebook.com/mjinicollections" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-1.5 -m-1.5 rounded-full" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Shop</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Heels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Sneakers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Beauty</a></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <p className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">Help</p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li><Link to="/orders" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Track Order</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Returns</a></li>
              <li><a href="tel:+254703739265" className="hover:text-primary transition-colors inline-block py-1.5 min-h-[36px] leading-relaxed">Contact</a></li>
            </ul>
          </div>

          {/* Copyright */}
          <div className="col-span-2 md:col-span-1 pt-3 md:pt-0 border-t border-border/10 md:border-0">
            <p className="text-muted-foreground uppercase tracking-[0.15em] text-sm font-serif text-center">
              © {new Date().getFullYear()} Mjini Collections
            </p>
            <p className="text-muted-foreground mt-1 text-center text-sm">Made with 💕 in Kenya</p>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;