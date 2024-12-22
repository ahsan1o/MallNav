import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Percent, Navigation2, Building2 } from 'lucide-react';
import { useMall } from '../hooks/useMall';

export function Home() {
  const { currentMall, loading } = useMall();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MallNav
        </h1>
        <p className="text-lg text-gray-600">
          Discover shops, deals, and find your way around with ease
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          to={currentMall ? "/shops" : "/mall-selection"}
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <ShoppingBag className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Browse Shops</h2>
          <p className="text-gray-600">
            {currentMall ? "Explore all stores" : "Select a mall to start"}
          </p>
        </Link>

        <Link
          to={currentMall ? "/mall-map" : "/mall-selection"}
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Navigation2 className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Mall Map</h2>
          <p className="text-gray-600">
            {currentMall ? "Interactive navigation" : "Select a mall to start"}
          </p>
        </Link>

        <Link
          to={currentMall ? "/deals" : "/mall-selection"}
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Percent className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">Latest Deals</h2>
          <p className="text-gray-600">
            {currentMall ? "Exclusive offers" : "Select a mall to start"}
          </p>
        </Link>

        <Link
          to="/mall-selection"
          className="group bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          <Building2 className="h-12 w-12 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-semibold mb-2">
            {currentMall ? 'Change Mall' : 'Select Mall'}
          </h2>
          <p className="text-gray-600">
            {currentMall ? currentMall.name : 'Choose your mall'}
          </p>
        </Link>
      </div>

      {!currentMall && (
        <div className="mt-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-6">
            Select Your Mall
          </h2>
          <p className="text-center text-indigo-100 mb-6">
            Choose your preferred mall to start exploring shops and deals
          </p>
          <div className="flex justify-center">
            <Link
              to="/mall-selection"
              className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
            >
              Select Mall
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}