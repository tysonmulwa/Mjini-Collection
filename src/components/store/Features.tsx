import { Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "Free within Nairobi for orders over KES 3,000",
    color: "from-primary/10 to-primary/5",
  },
  {
    icon: CreditCard,
    title: "M-Pesa & COD",
    description: "Pay via M-Pesa, card, or cash on delivery",
    color: "from-accent/10 to-accent/5",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day hassle-free return policy",
    color: "from-brand-gold/10 to-brand-gold/5",
  },
  {
    icon: Headphones,
    title: "WhatsApp Support",
    description: "Chat with us for quick assistance",
    color: "from-primary/10 to-primary/5",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-[11px] uppercase tracking-[0.25em] text-primary font-body font-bold mb-2">Why Choose Us</p>
          <h2 className="text-2xl md:text-4xl font-display font-black text-foreground">
            Shopping Made <span className="text-gradient-brand italic">Effortless</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl border border-border/30 p-6 text-center hover:border-primary/20 hover:shadow-lg transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm mb-1.5">{feature.title}</h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
