import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DeliveryFeeSettings {
  amount: number;
  free_threshold: number;
}

interface StoreInfo {
  store_name: string;
  phone: string;
  whatsapp: string;
  min_order_amount: number;
  operating_hours: string;
}

const defaultDelivery: DeliveryFeeSettings = { amount: 300, free_threshold: 3000 };
const defaultStore: StoreInfo = {
  store_name: "Mjini Collection",
  phone: "+254 703 739 265",
  whatsapp: "254703739265",
  min_order_amount: 0,
  operating_hours: "Mon-Sat: 8AM-8PM, Sun: 10AM-6PM",
};

export const useStoreSettings = () => {
  const [delivery, setDelivery] = useState<DeliveryFeeSettings>(defaultDelivery);
  const [storeInfo, setStoreInfo] = useState<StoreInfo>(defaultStore);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("store_settings")
        .select("key, value");
      if (data) {
        for (const row of data) {
          if (row.key === "delivery_fee") {
            const v = row.value as unknown as DeliveryFeeSettings;
            setDelivery({ amount: v.amount ?? 300, free_threshold: v.free_threshold ?? 3000 });
          }
          if (row.key === "store_info") {
            const v = row.value as unknown as StoreInfo;
            setStoreInfo({ ...defaultStore, ...v });
          }
        }
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const getDeliveryFee = (orderTotal: number) =>
    delivery.free_threshold > 0 && orderTotal >= delivery.free_threshold ? 0 : delivery.amount;

  return { delivery, storeInfo, loading, getDeliveryFee };
};
