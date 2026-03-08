import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Truck, Store } from "lucide-react";

const DeliveryFeeSettings = () => {
  const [amount, setAmount] = useState(300);
  const [freeThreshold, setFreeThreshold] = useState(3000);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "delivery_fee")
        .maybeSingle();
      if (data?.value) {
        const val = data.value as any;
        setAmount(val.amount ?? 300);
        setFreeThreshold(val.free_threshold ?? 3000);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("store_settings")
      .update({ value: { amount, free_threshold: freeThreshold } as any, updated_at: new Date().toISOString() })
      .eq("key", "delivery_fee");

    if (error) {
      toast.error("Failed to save delivery settings");
    } else {
      toast.success("Delivery fee settings saved!");
    }
    setSaving(false);
  };

  if (loading) return null;

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Truck className="w-5 h-5 text-primary" />
        <CardTitle className="text-base font-display">Delivery Fee Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-body text-sm">Delivery Fee (KES)</Label>
          <Input type="number" min={0} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="font-body mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Amount charged for delivery</p>
        </div>
        <div>
          <Label className="font-body text-sm">Free Delivery Threshold (KES)</Label>
          <Input type="number" min={0} value={freeThreshold} onChange={(e) => setFreeThreshold(Number(e.target.value))} className="font-body mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free delivery. Set to 0 to always charge.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-brand text-primary-foreground rounded-xl font-body">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Delivery Settings
        </Button>
      </CardContent>
    </Card>
  );
};

const StoreInfoSettings = () => {
  const [form, setForm] = useState({
    store_name: "Mjini Collection",
    phone: "+254 703 739 265",
    whatsapp: "254703739265",
    min_order_amount: 0,
    operating_hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "store_info")
        .maybeSingle();
      if (data?.value) {
        const val = data.value as any;
        setForm(prev => ({ ...prev, ...val }));
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    // Try update first, if no rows affected then insert
    const { error: updateError, count } = await supabase
      .from("store_settings")
      .update({ value: form as any, updated_at: new Date().toISOString() })
      .eq("key", "store_info");

    if (updateError) {
      // Try insert instead
      const { error: insertError } = await supabase
        .from("store_settings")
        .insert({ key: "store_info", value: form as any });
      if (insertError) {
        toast.error("Failed to save store settings");
        setSaving(false);
        return;
      }
    }
    toast.success("Store settings saved!");
    setSaving(false);
  };

  if (loading) return null;

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Store className="w-5 h-5 text-primary" />
        <CardTitle className="text-base font-display">Store Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="font-body text-sm">Store Name</Label>
          <Input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} className="font-body mt-1" />
        </div>
        <div>
          <Label className="font-body text-sm">Phone Number</Label>
          <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="font-body mt-1" placeholder="+254 7XX XXX XXX" />
        </div>
        <div>
          <Label className="font-body text-sm">WhatsApp Number</Label>
          <Input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} className="font-body mt-1" placeholder="254703739265" />
          <p className="text-xs text-muted-foreground mt-1">International format without + (e.g. 254703739265)</p>
        </div>
        <div>
          <Label className="font-body text-sm">Minimum Order Amount (KES)</Label>
          <Input type="number" min={0} value={form.min_order_amount} onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })} className="font-body mt-1" />
          <p className="text-xs text-muted-foreground mt-1">Set to 0 for no minimum</p>
        </div>
        <div>
          <Label className="font-body text-sm">Operating Hours</Label>
          <Input value={form.operating_hours} onChange={(e) => setForm({ ...form, operating_hours: e.target.value })} className="font-body mt-1" placeholder="Mon-Sat: 8AM-8PM" />
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-brand text-primary-foreground rounded-xl font-body">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Store Info
        </Button>
      </CardContent>
    </Card>
  );
};

export { DeliveryFeeSettings, StoreInfoSettings };
export default DeliveryFeeSettings;
