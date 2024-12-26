import { supabase } from '../supabase';
import type { Database } from '../../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export async function fetchMalls(): Promise<Mall[]> {
  try {
    const { data, error } = await supabase
      .from('malls')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching malls:', error);
      throw new Error('Unable to load malls. Please try again later.');
    }

    return data || [];
  } catch (err) {
    console.error('Error loading malls:', err);
    throw new Error('Unable to load malls. Please try again later.');
  }
}

export async function updatePreferredMall(userId: string, mallId: string) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        preferred_mall_id: mallId,
        first_name: '',
        last_name: ''
      }, {
        onConflict: 'user_id'
      });

    if (error) {
      console.error('Error updating preferred mall:', error);
      throw new Error('Unable to update mall preference. Please try again.');
    }
  } catch (err) {
    console.error('Error updating preferred mall:', err);
    throw new Error('Unable to update mall preference. Please try again.');
  }
}