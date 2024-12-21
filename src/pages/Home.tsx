import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Percent, Navigation2, Building2 } from 'lucide-react';

export function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Enigma Bird
        </h1>
        <p className="text-lg text-gray-600">
          Discover shops, deals, and find your way around with ease
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to="/shops"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <ShoppingBag className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Browse Shops</h2>
          <p className="text-gray-600">
            Explore all stores
          </p>
        </Link>

        <Link
          to="/mall-map"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Navigation2 className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Mall Map</h2>
          <p className="text-gray-600">
            Interactive navigation
          </p>
        </Link>

        <Link
          to="/deals"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Percent className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Latest Deals</h2>
          <p className="text-gray-600">
            Exclusive offers
          </p>
        </Link>

        <Link
          to="/mall-selection"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Building2 className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Change Mall</h2>
          <p className="text-gray-600">
            Switch location
          </p>
        </Link>
      </div>

      <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">
          Download Our App
        </h2>
        <p className="text-center text-indigo-100 mb-6">
          Get the best experience by installing Enigma Bird on your device
        </p>
        <div className="flex justify-center">
          <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
            Install App
          </button>
        </div>
      </div>
    </div>
  );
}