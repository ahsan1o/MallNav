import { supabase } from '../supabase';
import type { Database } from '../../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export async function fetchMalls(): Promise<Mall[]> {
  const { data, error } = await supabase
    .from('malls')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching malls:', error);
    throw new Error('Failed to fetch malls');
  }

  return data || [];
}

export async function updatePreferredMall(userId: string, mallId: string) {
  const { error } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: userId,
      preferred_mall_id: mallId,
      first_name: '',  // Required defaults
      last_name: ''    // Required defaults
    }, {
      onConflict: 'user_id'
    });

  if (error) {
    console.error('Error updating preferred mall:', error);
    throw new Error('Failed to update mall preference');
  }
}