import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground/80 py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-brand rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold">M</span>
              </div>
              <span className="font-display font-bold text-primary-foreground text-lg">Mjini Collections</span>
            </div>
            <p className="text-sm font-body leading-relaxed mb-4">
              Your destination for premium ladies' shoes and beauty products in Kenya.
            </p>
            <div className="space-y-2 text-sm font-body">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>hello@mjinicollections.co.ke</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground text-sm mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li><a href="#" className="hover:text-primary transition-colors">Heels</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sneakers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Sandals</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Makeup</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Skincare</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground text-sm mb-4">Help</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li><a href="#" className="hover:text-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-primary-foreground text-sm mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm font-body">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">WhatsApp Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs font-body text-primary-foreground/50">
            © {new Date().getFullYear()} Mjini Collections. All rights reserved. Made with 💕 in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
