import React from 'react';
import { ShoppingBag, Percent, Navigation2 } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MallNav
        </h1>
        <p className="text-lg text-gray-600">
          Discover shops, deals, and find your way around with ease
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <ShoppingBag className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Browse Shops</h2>
          <p className="text-gray-600">
            Explore all stores in the mall with detailed information
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <Percent className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Latest Deals</h2>
          <p className="text-gray-600">
            Stay updated with the newest discounts and promotions
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <Navigation2 className="h-12 w-12 text-indigo-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Indoor Navigation</h2>
          <p className="text-gray-600">
            Find your way to any store with real-time navigation
          </p>
        </div>
      </div>

      <div className="mt-12 bg-indigo-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Download Our App
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Get the best experience by installing MallNav on your device
        </p>
        <div className="flex justify-center">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}