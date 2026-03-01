import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="py-16 gradient-brand">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
          Stay In The Loop
        </h2>
        <p className="text-primary-foreground/70 font-body text-sm mb-8">
          Get exclusive offers, new arrivals & beauty tips delivered to your inbox
        </p>
        <form onSubmit={handleSubscribe} className="max-w-sm mx-auto flex gap-2">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-full border-0 bg-primary-foreground font-body text-sm text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            className="bg-foreground text-primary-foreground hover:bg-foreground/90 rounded-full px-6 font-body font-semibold text-sm"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
