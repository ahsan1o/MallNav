import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchShops() {
      try {
        const { data, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .order('name');

        if (shopError) throw shopError;
        setShops(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch shops'));
      } finally {
        setLoading(false);
      }
    }

    fetchShops();
  }, []);

  return { shops, loading, error };
}