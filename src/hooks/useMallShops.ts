import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];

export function useMallShops(mallId: string | null) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShops() {
      if (!mallId) {
        setShops([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const { data, error: shopError } = await supabase
          .from('shops')
          .select(`
            *,
            promotions (*)
          `)
          .eq('mall_id', mallId);

        if (shopError) throw shopError;
        setShops(data || []);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch shops'));
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchShops();
  }, [mallId]);

  return { shops, loading, error };
}