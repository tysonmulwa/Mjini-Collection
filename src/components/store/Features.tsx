import { Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Delivery", description: "Free within Nairobi for orders over KES 3,000" },
  { icon: CreditCard, title: "M-Pesa & COD", description: "Pay via M-Pesa, card, or cash on delivery" },
  { icon: RotateCcw, title: "Easy Returns", description: "30-day hassle-free return policy" },
  { icon: Headphones, title: "WhatsApp Support", description: "Chat with us for quick assistance" },
];

const Features = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body font-medium mb-3">Why Choose Us</p>
          <h2 className="text-2xl md:text-4xl font-display font-bold text-foreground">
            Shopping Made <span className="italic text-primary">Effortless</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group text-center p-6 border border-border/50 bg-card hover:border-primary/20 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 border border-primary/30 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/5 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground text-sm mb-2">{feature.title}</h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
