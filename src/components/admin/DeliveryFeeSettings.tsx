import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Truck } from "lucide-react";

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
          <Input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="font-body mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Amount charged for delivery</p>
        </div>
        <div>
          <Label className="font-body text-sm">Free Delivery Threshold (KES)</Label>
          <Input
            type="number"
            min={0}
            value={freeThreshold}
            onChange={(e) => setFreeThreshold(Number(e.target.value))}
            className="font-body mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Orders above this amount get free delivery. Set to 0 to always charge.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gradient-brand text-primary-foreground rounded-xl font-body">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeliveryFeeSettings;
