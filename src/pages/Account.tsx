import { useEffect, useState } from "react";
import PageTransition from "@/components/store/PageTransition";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, User, Package, Settings, LogOut, Shield } from "lucide-react";

const Account = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ full_name: "", phone: "", address: "", city: "Nairobi" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (data) setProfile({ full_name: data.full_name || "", phone: data.phone || "", address: data.address || "", city: data.city || "Nairobi" });
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-muted-foreground font-body mb-4">Please sign in to view your account</p>
          <Link to="/login"><Button className="gradient-brand text-primary-foreground rounded-xl font-body">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, phone: profile.phone, address: profile.address, city: profile.city,
    }).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to update profile"); return; }
    toast.success("Profile updated!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-body mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to shop
        </Link>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">My Account</h1>

        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
          <Link to="/orders" className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-colors text-center">
            <Package className="w-5 h-5 mx-auto mb-2 text-primary" />
            <span className="text-sm font-body font-medium text-foreground">My Orders</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className="bg-card rounded-xl border border-border p-4 hover:border-primary/50 transition-colors text-center">
              <Shield className="w-5 h-5 mx-auto mb-2 text-primary" />
              <span className="text-sm font-body font-medium text-foreground">Admin Panel</span>
            </Link>
          )}
          <button onClick={handleSignOut} className="bg-card rounded-xl border border-border p-4 hover:border-destructive/50 transition-colors text-center">
            <LogOut className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <span className="text-sm font-body font-medium text-foreground">Sign Out</span>
          </button>
        </div>

        {/* Profile Form */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="bg-card rounded-xl border border-border p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 gradient-brand rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-display font-semibold text-foreground text-sm">{profile.full_name || "User"}</p>
                <p className="text-xs text-muted-foreground font-body">{user.email}</p>
              </div>
            </div>

            <div>
              <Label className="font-body text-sm">Full Name</Label>
              <Input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Phone</Label>
              <Input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="+254 7XX XXX XXX" className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">Address</Label>
              <Input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} placeholder="Street, building" className="font-body mt-1" />
            </div>
            <div>
              <Label className="font-body text-sm">City</Label>
              <Input value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} className="font-body mt-1" />
            </div>
            <Button type="submit" disabled={saving} className="w-full gradient-brand text-primary-foreground rounded-xl font-body font-semibold">
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Account;
