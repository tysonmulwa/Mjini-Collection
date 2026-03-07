import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden py-20">
      {/* Background */}
      <div className="absolute inset-0 gradient-brand" />
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '24px 24px'
      }} />
      <div className="absolute -top-1/2 -right-1/4 w-[500px] h-[500px] bg-primary-foreground/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-primary-foreground/60 font-body font-bold mb-3">Newsletter</p>
        <h2 className="text-2xl md:text-4xl font-display font-black text-primary-foreground mb-3">
          Stay In The <span className="italic font-light">Loop</span>
        </h2>
        <p className="text-primary-foreground/60 font-body text-sm mb-8 max-w-md mx-auto">
          Get exclusive offers, new arrivals & beauty tips delivered to your inbox
        </p>
        <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-xl border-0 bg-primary-foreground/10 backdrop-blur-md text-primary-foreground placeholder:text-primary-foreground/40 font-body text-sm h-12 px-5 focus-visible:ring-2 focus-visible:ring-primary-foreground/30"
          />
          <Button
            type="submit"
            className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 rounded-xl px-6 h-12 font-body font-bold text-sm shadow-xl hover:scale-[1.02] transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
