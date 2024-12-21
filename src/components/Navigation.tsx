import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, User, Bell, Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Mall {
  id: string;
  name: string;
}

export function Navigation() {
  const { user } = useAuth();
  const [currentMall, setCurrentMall] = useState<Mall | null>(null);
  const [malls, setMalls] = useState<Mall[]>([]);

  useEffect(() => {
    async function fetchMalls() {
      try {
        const { data, error } = await supabase
          .from('malls')
          .select('id, name');
        
        if (error) throw error;
        setMalls(data || []);

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('preferred_mall_id')
            .eq('user_id', user.id)
            .single();

          if (profile?.preferred_mall_id) {
            const preferredMall = data?.find(m => m.id === profile.preferred_mall_id);
            setCurrentMall(preferredMall || null);
          }
        }
      } catch (error) {
        console.error('Error fetching malls:', error);
      }
    }

    fetchMalls();
  }, [user]);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">Enigma Bird</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <select
                className="form-select rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                value={currentMall?.id || ''}
                onChange={(e) => {
                  const selected = malls.find(m => m.id === e.target.value);
                  setCurrentMall(selected || null);
                }}
              >
                <option value="">Select Mall</option>
                {malls.map((mall) => (
                  <option key={mall.id} value={mall.id}>
                    {mall.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <Link to="/shops" className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}