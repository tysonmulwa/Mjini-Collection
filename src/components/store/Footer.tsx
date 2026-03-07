import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/70">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 gradient-brand rounded-xl flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-display font-black text-lg">M</span>
              </div>
              <span className="font-display font-bold text-background text-lg">Mjini</span>
            </div>
            <p className="text-sm font-body leading-relaxed mb-5">
              Your destination for premium ladies' shoes and beauty products in Kenya.
            </p>
            <div className="space-y-2.5 text-sm font-body">
              <a href="tel:+254703739265" className="flex items-center gap-2.5 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>+254 703 739 265</span>
              </a>
              <a href="mailto:hello@mjinicollections.co.ke" className="flex items-center gap-2.5 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>hello@mjinicollections.co.ke</span>
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Shop",
              links: ["Heels", "Sneakers", "Sandals", "Makeup", "Skincare"],
            },
            {
              title: "Help",
              links: ["Size Guide", "Shipping Info", "Returns", "Track Order"],
            },
            {
              title: "Company",
              links: ["About Us", "Contact", "Privacy Policy", "WhatsApp Support"],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-background text-sm mb-4 uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-3 text-sm font-body">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-primary transition-colors duration-200">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-background/40">
            © {new Date().getFullYear()} Mjini Collections. All rights reserved.
          </p>
          <p className="text-xs font-body text-background/40">
            Made with 💕 in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
