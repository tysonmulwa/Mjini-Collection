import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroBannerProps {
  onCategorySelect: (category: string) => void;
}

const HeroBanner = ({ onCategorySelect }: HeroBannerProps) => {
  return (
    <section className="relative overflow-hidden gradient-brand py-10 md:py-14">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 left-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-5 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl mx-auto text-center">
          <p className="uppercase tracking-[0.3em] text-white/70 text-[10px] font-body font-medium mb-3 animate-fade-in">
            New Season Collection
          </p>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-3 leading-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Step Into Elegance
          </h2>
          <p className="text-sm text-white/80 mb-6 font-body font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Curated ladies' fashion shoes & premium beauty products delivered across Kenya
          </p>
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => onCategorySelect("shoes")}
              className="bg-white text-neutral-900 hover:bg-white/90 rounded-full px-6 py-2 font-body font-semibold text-sm shadow-lg"
            >
              Shop Shoes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={() => onCategorySelect("beauty")}
              className="bg-white/15 text-white hover:bg-white/25 border border-white/30 rounded-full px-6 py-2 font-body font-semibold text-sm backdrop-blur-sm"
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
