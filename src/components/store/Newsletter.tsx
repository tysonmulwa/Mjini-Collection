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
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="md:flex-row md:gap-6 max-w-4xl flex-col rounded-xl gap-[20px] flex items-center justify-between mx-0 my-0 px-0 py-px">
          <div className="text-center md:text-left">
            <h3 className="text-base md:text-lg font-semibold text-foreground mb-1">
              Stay updated
            </h3>
            <p className="text-xs md:text-sm text-muted-foreground">
              Get exclusive offers & new arrivals in your inbox
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto px-0 mx-0 my-0">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 md:w-64 h-11 min-h-[44px] text-sm bg-background border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary transition-colors px-0" />
            
            <button
              type="submit"
              className="h-11 min-h-[44px] px-5 bg-primary text-primary-foreground text-sm font-medium transition-opacity active:scale-[0.97] flex-row gap-[10px] rounded-3xl flex items-center justify-start text-left opacity-100">
              
              Subscribe
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>);

};

export default Newsletter;