import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];
type Promotion = Database['public']['Tables']['promotions']['Row'];

export function useShop(id: string) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShopData() {
      try {
        // Fetch shop details
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', id)
          .single();

        if (shopError) throw shopError;
        setShop(shopData);

        // Fetch active promotions
        const { data: promoData, error: promoError } = await supabase
          .from('promotions')
          .select('*')
          .eq('shop_id', id)
          .gte('valid_until', new Date().toISOString());

        if (promoError) throw promoError;
        setPromotions(promoData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch shop data'));
      } finally {
        setLoading(false);
      }
    }

    fetchShopData();
  }, [id]);

  return { shop, promotions, loading, error };
}