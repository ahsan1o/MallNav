import { useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';

interface UseSupabaseQueryResult<T> {
  data: T | null;
  error: PostgrestError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useSupabaseQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  deps: any[] = []
): UseSupabaseQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<PostgrestError | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      setLoading(true);
      const { data, error } = await queryFn();
      
      if (error) {
        setError(error);
        setData(null);
      } else {
        setData(data);
        setError(null);
      }
    } catch (err) {
      setError(err as PostgrestError);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, deps);

  return { data, error, loading, refetch: fetchData };
}