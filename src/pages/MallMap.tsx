import React, { useState } from 'react';
import { Map } from '../components/Map';
import { Map3D } from '../components/Map3D';
import { useShops } from '../hooks/useShops';

export function MallMap() {
  const [view, setView] = useState<'2d' | '3d'>('2d');
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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Mall Map</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setView('2d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === '2d'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                2D View
              </button>
              <button
                onClick={() => setView('3d')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  view === '3d'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                3D View
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          {view === '2d' ? (
            <Map shop={shops[0]} />
          ) : (
            <Map3D shops={shops} onShopSelect={() => {}} />
          )}
        </div>
      </div>
    </div>
  );
}