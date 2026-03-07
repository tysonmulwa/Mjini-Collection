import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden py-20 bg-accent">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="w-12 h-px bg-primary/40 mx-auto mb-6" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 font-body font-medium mb-3">Newsletter</p>
        <h2 className="text-2xl md:text-4xl font-display font-bold text-accent-foreground mb-3">
          Stay In The <span className="italic text-primary">Loop</span>
        </h2>
        <p className="text-accent-foreground/40 font-body text-sm mb-10 max-w-md mx-auto">
          Get exclusive offers, new arrivals & beauty tips delivered to your inbox
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-0">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-none border border-accent-foreground/15 bg-transparent text-accent-foreground placeholder:text-accent-foreground/30 font-body text-sm h-12 px-5 focus-visible:ring-1 focus-visible:ring-primary/40"
          />
          <Button
            type="submit"
            className="gradient-brand text-primary-foreground rounded-none px-6 h-12 font-body font-semibold text-xs uppercase tracking-wider"
          >
            Subscribe
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
