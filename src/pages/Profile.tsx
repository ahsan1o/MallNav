import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Bell, Heart, Settings } from 'lucide-react';
import type { Database } from '../types/database';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

export function Profile() {
  const { user, signOut } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPreferences() {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setPreferences(data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPreferences();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 px-4 py-5 sm:px-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">{user?.email}</h3>
              <p className="text-indigo-200">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
              <div className="mt-4 space-y-4">
                {preferences?.notification_settings && Object.entries(preferences.notification_settings).map(([key, enabled]) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      type="checkbox"
                      checked={enabled}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={() => {/* Add notification toggle handler */}}
                    />
                    <label htmlFor={key} className="ml-3 text-sm text-gray-700 capitalize">
                      {key.replace('_', ' ')} notifications
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Preferred Categories</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {preferences?.preferred_categories?.map((category) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}