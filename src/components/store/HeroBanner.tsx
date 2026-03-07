import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroBannerProps {
  onCategorySelect: (category: string) => void;
}

const HeroBanner = ({ onCategorySelect }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden gradient-brand">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-primary-foreground/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-foreground/5 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '32px 32px'
      }} />

      <div className="container mx-auto px-4 relative z-10 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/90 font-body font-semibold">
              New Season 2025
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-primary-foreground mb-4 leading-[1.1] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Step Into
            <br />
            <span className="italic font-light">Elegance</span>
          </h2>

          <p className="text-sm md:text-base text-primary-foreground/70 mb-8 font-body font-light max-w-md mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Curated ladies' fashion shoes & premium beauty products — delivered across Kenya
          </p>

          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => onCategorySelect("shoes")}
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-7 py-3 h-12 font-body font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              Shop Shoes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onCategorySelect("beauty")}
              variant="outline"
              className="bg-transparent text-primary-foreground hover:bg-primary-foreground/10 border-2 border-primary-foreground/40 hover:border-primary-foreground/60 rounded-full px-7 py-3 h-12 font-body font-bold text-sm backdrop-blur-sm transition-all duration-300"
            >
              Beauty Products
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "500+", label: "Products" },
              { value: "2K+", label: "Happy Customers" },
              { value: "24h", label: "Fast Delivery" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl md:text-2xl font-display font-black text-primary-foreground">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-primary-foreground/50 font-body font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
