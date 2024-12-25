import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export function useMall() {
  const { user } = useAuth();
  const [currentMall, setCurrentMall] = useState<Mall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMallData() {
      if (!user) {
        setCurrentMall(null);
        setLoading(false);
        return;
      }

      try {
        setError(null);
        // First get the user's preferred mall ID
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('preferred_mall_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (profile?.preferred_mall_id) {
          // Then fetch the mall details
          const { data: mall, error: mallError } = await supabase
            .from('malls')
            .select('*')
            .eq('id', profile.preferred_mall_id)
            .single();

          if (mallError) throw mallError;
          setCurrentMall(mall);
        } else {
          setCurrentMall(null);
        }
      } catch (err) {
        console.error('Error fetching mall:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch mall data'));
        setCurrentMall(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMallData();
  }, [user]);

  return { currentMall, loading, error };
}