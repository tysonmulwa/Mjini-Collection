import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Thanks for subscribing!");
    setEmail("");
  };

  return (
    <section className="bg-card border-y border-border/30">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Stay updated
            </h3>
            <p className="text-sm text-muted-foreground">
              Get exclusive offers & new arrivals in your inbox
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 md:w-64 h-11 px-4 text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="h-11 px-5 bg-primary text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Subscribe
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
