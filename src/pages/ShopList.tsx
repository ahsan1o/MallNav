import React, { useState, useEffect } from 'react';
import { ShopCard } from '../components/ShopCard';
import { supabase } from '../lib/supabase';
import { Search, Filter } from 'lucide-react';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];
type Promotion = Database['public']['Tables']['promotions']['Row'];

export function ShopList() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch shops
        const { data: shopsData, error: shopsError } = await supabase
          .from('shops')
          .select('*')
          .order('name');

        if (shopsError) throw shopsError;
        setShops(shopsData);

        // Fetch active promotions
        const { data: promoData, error: promoError } = await supabase
          .from('promotions')
          .select('*')
          .gte('valid_until', new Date().toISOString());

        if (promoError) throw promoError;
        setPromotions(promoData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Failed to load shops. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mall Shops</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shops..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <ShopCard
            key={shop.id}
            shop={shop}
            promotions={promotions.filter(p => p.shop_id === shop.id)}
          />
        ))}
      </div>
    </div>
  );
}