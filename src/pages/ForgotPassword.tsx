import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
    toast.success("Check your email for the reset link");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link to="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 font-body">
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>
        <h1 className="text-2xl font-display font-bold text-foreground mb-2">Reset Password</h1>
        <p className="text-sm text-muted-foreground font-body mb-8">We'll send you a link to reset your password.</p>

        {sent ? (
          <p className="text-center text-sm text-muted-foreground font-body bg-secondary p-4 rounded-xl">
            ✅ If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="font-body text-sm">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="font-body mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-brand text-primary-foreground rounded-xl font-body font-semibold">
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
