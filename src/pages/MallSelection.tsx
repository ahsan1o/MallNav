import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { fetchMalls, updatePreferredMall } from '../lib/api/malls';
import { ErrorDisplay } from '../components/ErrorDisplay';
import type { Database } from '../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];

export function MallSelection() {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const qrMallId = new URLSearchParams(location.search).get('mallId');

  useEffect(() => {
    async function loadMalls() {
      try {
        setError(null);
        const data = await fetchMalls();
        setMalls(data);

        if (qrMallId && user) {
          await handleMallSelect(qrMallId);
        }
      } catch (err) {
        console.error('Error loading malls:', err);
        setError(err instanceof Error ? err : new Error('Failed to load malls'));
      } finally {
        setLoading(false);
      }
    }

    loadMalls();
  }, [user, qrMallId]);

  const handleMallSelect = async (mallId: string) => {
    try {
      setError(null);
      if (!user) {
        sessionStorage.setItem('selectedMallId', mallId);
        navigate('/login', { state: { from: location } });
        return;
      }

      await updatePreferredMall(user.id, mallId);
      navigate('/shops');
    } catch (err) {
      console.error('Error selecting mall:', err);
      setError(err instanceof Error ? err : new Error('Failed to update mall preference'));
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Select Your Mall
        </h1>

        {error && <ErrorDisplay error={error} className="mb-6" />}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {malls.map((mall) => (
            <button
              key={mall.id}
              onClick={() => handleMallSelect(mall.id)}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-left"
            >
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <img
                  src={mall.image_url || 'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6'}
                  alt={mall.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {mall.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {mall.description || 'Visit this mall for an amazing shopping experience'}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {mall.location}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}