import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Mall {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export function MallSelection() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchMalls() {
      try {
        const { data, error } = await supabase
          .from('malls')
          .select('*')
          .order('name');

        if (error) throw error;
        setMalls(data || []);
      } catch (error) {
        console.error('Error fetching malls:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchMalls();
  }, []);

  const handleMallSelect = async (mallId: string) => {
    if (!user?.id) {
      console.error('No user ID available');
      return;
    }

    try {
      // Check if user profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update({ preferred_mall_id: mallId })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            preferred_mall_id: mallId,
            first_name: '',
            last_name: ''
          });

        if (error) throw error;
      }

      navigate('/');
    } catch (error) {
      console.error('Error updating preferred mall:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Building2 className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">
            Select Your Preferred Mall
          </h1>
          <p className="mt-2 text-gray-600">
            Choose the mall you visit most frequently
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {malls.map((mall) => (
            <button
              key={mall.id}
              onClick={() => handleMallSelect(mall.id)}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={mall.image_url}
                alt={mall.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{mall.name}</h3>
                <p className="mt-1 text-gray-600">{mall.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}