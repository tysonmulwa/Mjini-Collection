import { Truck, CreditCard, RotateCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";

const features = [
{ icon: Truck, title: "Free Delivery", description: "Free within Nairobi for orders over KES 3,000" },
{ icon: CreditCard, title: "M-Pesa & COD", description: "Pay via M-Pesa, card, or cash on delivery" },
{ icon: RotateCcw, title: "Easy Returns", description: "30-day hassle-free return policy" },
{ icon: Headphones, title: "WhatsApp Support", description: "Chat with us for quick assistance" }];


const Features = () => {
  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8 md:mb-14">
          
          <div className="w-12 h-px bg-primary mx-auto mb-4 md:mb-6" />
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-body font-medium mb-2 md:mb-3">Why Choose Us</p>
          <h2 className="text-xl md:text-4xl font-display font-bold text-foreground">
            Shopping Made <span className="italic text-primary">Effortless</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {features.map((feature, i) =>
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="group text-center p-4 md:p-6 border-border/50 bg-card hover:border-primary/20 transition-all duration-500 py-0 px-0 border-0 rounded-2xl">
            
              <div className="w-10 h-10 md:w-12 md:h-12 border border-primary/30 mx-auto mb-3 md:mb-5 group-hover:bg-primary/5 transition-colors duration-300 flex items-end justify-center opacity-100 rounded-full">
                <feature.icon className="text-primary md:w-[20px] md:h-[20px] h-[29px] w-[25px]" />
              </div>
              <h3 className="font-display font-semibold text-foreground md:text-sm mb-1.5 md:mb-2 text-sm">{feature.title}</h3>
              <p className="md:text-xs text-muted-foreground font-body leading-relaxed text-sm font-normal">{feature.description}</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>);

};

export default Features;