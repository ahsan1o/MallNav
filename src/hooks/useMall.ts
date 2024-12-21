import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export function useMall() {
  const [currentMall, setCurrentMall] = useState<Mall | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCurrentMall() {
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('preferred_mall_id')
          .single();

        if (profile?.preferred_mall_id) {
          const { data: mall } = await supabase
            .from('malls')
            .select('*')
            .eq('id', profile.preferred_mall_id)
            .single();

          setCurrentMall(mall);
        }
      } catch (error) {
        console.error('Error fetching current mall:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentMall();
  }, []);

  return { currentMall, loading };
}