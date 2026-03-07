import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border/10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Contact */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-primary/30 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-foreground text-sm">Mjini</span>
            </div>
            <div className="flex flex-col gap-1 text-xs text-muted-foreground">
              <a href="tel:+254703739265" className="hover:text-primary transition-colors">+254 703 739 265</a>
              <a href="mailto:hello@mjinicollections.co.ke" className="hover:text-primary transition-colors">hello@mjinicollections.co.ke</a>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-8 text-xs">
            <div>
              <p className="font-semibold text-foreground mb-2 uppercase tracking-wider">Shop</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Heels</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Sneakers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Beauty</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2 uppercase tracking-wider">Help</p>
              <ul className="space-y-1 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
              © {new Date().getFullYear()} Mjini Collections
            </p>
            <p className="text-[10px] text-muted-foreground">Made with 💕 in Kenya</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
