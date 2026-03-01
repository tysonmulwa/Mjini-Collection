import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  onCategorySelect: (category: string) => void;
}

const HeroBanner = ({ onCategorySelect }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden gradient-brand py-20 md:py-28">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-primary-foreground/70 text-xs font-body font-medium mb-4 animate-fade-in">
            New Season Collection
          </p>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Step Into
            <br />
            Elegance
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 font-body font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Curated ladies' fashion shoes & premium beauty products
            <br className="hidden sm:block" />
            delivered across Kenya
          </p>
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => onCategorySelect("shoes")}
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-full px-8 py-3 font-body font-semibold text-sm shadow-lg"
            >
              Shop Shoes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onCategorySelect("beauty")}
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 rounded-full px-8 py-3 font-body font-semibold text-sm"
            >
              Beauty Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
