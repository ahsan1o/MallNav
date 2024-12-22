import { useSupabaseQuery } from './useSupabaseQuery';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../types/database';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

export function useUserPreferences() {
  const { user } = useAuth();

  const { data: preferences, loading, error, refetch } = useSupabaseQuery<UserPreferences>(
    () => {
      if (!user?.id) {
        return Promise.resolve({ data: null, error: null });
      }
      return supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
    },
    [user?.id]
  );

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) return null;

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        notification_settings: {
          deals: true,
          favorites: true,
          nearby: true,
          ...updates.notification_settings
        },
        preferred_categories: updates.preferred_categories || [],
        favorite_shops: updates.favorite_shops || []
      })
      .select()
      .single();

    if (error) throw error;
    refetch();
    return data;
  };

  return {
    preferences,
    loading,
    error,
    updatePreferences
  };
}