import { supabase, handleSupabaseError } from '../supabase';
import type { Database } from '../../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export async function fetchMalls(): Promise<Mall[]> {
  return handleSupabaseError(
    supabase
      .from('malls')
      .select('*')
      .order('name')
  );
}

export async function updatePreferredMall(userId: string, mallId: string) {
  return handleSupabaseError(
    supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        preferred_mall_id: mallId,
        first_name: '',
        last_name: ''
      }, {
        onConflict: 'user_id'
      })
  );
}