import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Tag, MapPin } from 'lucide-react';
import type { Database } from '../types/database';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'promotion' | 'nearby' | 'system';
  created_at: string;
  read: boolean;
};

export function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchNotifications();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <Bell className="h-6 w-6 text-gray-400" />
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow-sm p-4 ${
                !notification.read ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="flex items-start">
                {notification.type === 'promotion' && (
                  <Tag className="h-5 w-5 text-green-500 mt-1 mr-3" />
                )}
                {notification.type === 'nearby' && (
                  <MapPin className="h-5 w-5 text-blue-500 mt-1 mr-3" />
                )}
                {notification.type === 'system' && (
                  <Bell className="h-5 w-5 text-gray-500 mt-1 mr-3" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}