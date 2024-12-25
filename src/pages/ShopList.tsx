import React, { useState } from 'react';
import { ShopCard } from '../components/ShopCard';
import { useMall } from '../hooks/useMall';
import { useMallShops } from '../hooks/useMallShops';
import { useTopPromotion } from '../hooks/useTopPromotion';
import { PromotionalBanner } from '../components/PromotionalBanner';
import { Search, Filter, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ErrorDisplay } from '../components/ErrorDisplay';

export function ShopList() {
  const { currentMall, error: mallError } = useMall();
  const { shops, loading: shopsLoading, error: shopsError } = useMallShops(currentMall?.id ?? null);
  const { topPromotion, loading: promoLoading } = useTopPromotion(currentMall?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!currentMall) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Mall Selected</h2>
        <p className="text-gray-500 mb-6">Please select a mall to view its shops</p>
        <Link
          to="/mall-selection"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Select a Mall
        </Link>
      </div>
    );
  }

  if (shopsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {mallError && <ErrorDisplay error={mallError} className="mb-6" />}
      {shopsError && <ErrorDisplay error={shopsError} className="mb-6" />}

      {topPromotion && !promoLoading && (
        <PromotionalBanner promotion={topPromotion} />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shops at {currentMall.name}</h1>
          <p className="text-gray-600 mt-1">{currentMall.description}</p>
        </div>
        <div className="flex space-x-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search shops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="h-5 w-5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {filteredShops.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shops found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              promotions={(shop as any).promotions}
            />
          ))}
        </div>
      )}
    </div>
  );
}