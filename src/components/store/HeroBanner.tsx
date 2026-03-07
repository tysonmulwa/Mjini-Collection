import { Button } from "@/components/ui/button";
import { ArrowRight, Diamond } from "lucide-react";

interface HeroBannerProps {
  onCategorySelect: (category: string) => void;
}

const HeroBanner = ({ onCategorySelect }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden bg-accent">
      {/* Subtle gold light effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* Fine line pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(90deg, hsl(38 70% 50%) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          {/* Elegant badge */}
          <div className="inline-flex items-center gap-2.5 border border-primary/30 rounded-none px-5 py-2 mb-8 animate-fade-in">
            <Diamond className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary font-body font-medium">
              New Collection 2025
            </span>
            <Diamond className="w-3 h-3 text-primary" />
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-accent-foreground mb-5 leading-[1.05] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Step Into
            <br />
            <span className="italic text-primary">Elegance</span>
          </h2>

          <p className="text-sm md:text-base text-accent-foreground/50 mb-10 font-body font-light max-w-lg mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Curated ladies' fashion shoes & premium beauty products — delivered across Kenya
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => onCategorySelect("shoes")}
              className="gradient-brand text-primary-foreground rounded-none px-8 py-3 h-12 font-body font-semibold text-sm tracking-wide uppercase hover:opacity-90 transition-opacity duration-300"
            >
              Shop Shoes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onCategorySelect("beauty")}
              variant="outline"
              className="bg-transparent text-accent-foreground/80 hover:text-accent-foreground border border-accent-foreground/20 hover:border-accent-foreground/40 rounded-none px-8 py-3 h-12 font-body font-semibold text-sm tracking-wide uppercase transition-all duration-300"
            >
              Beauty Products
            </Button>
          </div>

          {/* Elegant divider + stats */}
          <div className="mt-14 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="w-16 h-px bg-primary/40 mx-auto mb-8" />
            <div className="flex items-center justify-center gap-12">
              {[
                { value: "500+", label: "Products" },
                { value: "2K+", label: "Clients" },
                { value: "24h", label: "Delivery" },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-display font-bold text-primary">{stat.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-accent-foreground/35 font-body font-medium mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
