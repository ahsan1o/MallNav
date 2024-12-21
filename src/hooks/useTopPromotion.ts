import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Promotion = Database['public']['Tables']['promotions']['Row'] & {
  shop: Database['public']['Tables']['shops']['Row']
};

export function useTopPromotion(mallId: string | null) {
  const [topPromotion, setTopPromotion] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopPromotion() {
      if (!mallId) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('promotions')
          .select(`
            *,
            shop:shops(*)
          `)
          .eq('shops.mall_id', mallId)
          .gte('valid_until', new Date().toISOString())
          .order('discount_percentage', { ascending: false })
          .limit(1)
          .single();

        setTopPromotion(data as Promotion);
      } catch (error) {
        console.error('Error fetching top promotion:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopPromotion();
  }, [mallId]);

  return { topPromotion, loading };
}