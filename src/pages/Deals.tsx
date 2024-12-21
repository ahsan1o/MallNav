import React from 'react';
import { Tag, Search } from 'lucide-react';
import { useShops } from '../hooks/useShops';

export function Deals() {
  const { shops, loading } = useShops();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Latest Deals</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search deals..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shops.map((shop) => (
          <div key={shop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={shop.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'}
              alt={shop.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-5 w-5 text-green-500" />
                <span className="text-green-500 font-medium">30% OFF</span>
              </div>
              <h3 className="text-lg font-semibold">{shop.name}</h3>
              <p className="text-gray-600 mt-1">Special discount on selected items</p>
              <p className="text-sm text-gray-500 mt-2">Valid until March 31, 2024</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}