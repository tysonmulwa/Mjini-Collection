import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DeliveryFeeSettings {
  amount: number;
  free_threshold: number;
}

export const useDeliveryFee = () => {
  const [settings, setSettings] = useState<DeliveryFeeSettings>({ amount: 300, free_threshold: 3000 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("value")
        .eq("key", "delivery_fee")
        .maybeSingle();
      if (data?.value) {
        const val = data.value as unknown as DeliveryFeeSettings;
        setSettings({ amount: val.amount ?? 300, free_threshold: val.free_threshold ?? 3000 });
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const getDeliveryFee = (orderTotal: number) =>
    orderTotal >= settings.free_threshold ? 0 : settings.amount;

  return { settings, loading, getDeliveryFee };
};
