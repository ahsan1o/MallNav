import React, { useState, useEffect } from 'react';
import { ShopCard } from '../components/ShopCard';
import { useMall } from '../hooks/useMall';
import { useTopPromotion } from '../hooks/useTopPromotion';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { supabase } from '../lib/supabase';
import { Search, Filter } from 'lucide-react';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];
type Promotion = Database['public']['Tables']['promotions']['Row'];

export function ShopList() {
  const { currentMall, loading: mallLoading } = useMall();
  const { topPromotion, loading: promoLoading } = useTopPromotion(currentMall?.id ?? null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!currentMall) return;

      try {
        // Fetch shops for current mall
        const { data: shopsData } = await supabase
          .from('shops')
          .select('*')
          .eq('mall_id', currentMall.id)
          .order('name');

        setShops(shopsData || []);

        // Fetch active promotions
        const { data: promoData } = await supabase
          .from('promotions')
          .select('*')
          .gte('valid_until', new Date().toISOString());

        setPromotions(promoData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [currentMall]);

  if (loading || mallLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentMall) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please select a mall first</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {topPromotion && !promoLoading && (
        <PromotionalBanner promotion={topPromotion} />
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shops at {currentMall.name}</h1>
          <p className="text-gray-600 mt-1">{currentMall.description}</p>
        </div>
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