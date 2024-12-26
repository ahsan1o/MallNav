import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, User, Bell, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMall } from '../hooks/useMall';

export function Navigation() {
  const { user } = useAuth();
  const { currentMall } = useMall();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">MallNav</span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              {currentMall ? (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 font-medium hidden md:inline">
                    Current Mall:
                  </span>
                  <Link
                    to="/mall-selection"
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {currentMall.name}
                  </Link>
                </div>
              ) : (
                <Link
                  to="/mall-selection"
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Select Mall
                </Link>
              )}
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            {currentMall && (
              <>
                <Link 
                  to="/shops" 
                  className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-1"
                >
                  <ShoppingBag className="h-6 w-6" />
                  <span className="hidden md:inline text-sm">Shops</span>
                </Link>
                <Link 
                  to="/mall-map" 
                  className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-1"
                >
                  <MapPin className="h-6 w-6" />
                  <span className="hidden md:inline text-sm">Map</span>
                </Link>
              </>
            )}
            <Link 
              to="/notifications" 
              className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-1"
            >
              <Bell className="h-6 w-6" />
              <span className="hidden md:inline text-sm">Alerts</span>
            </Link>
            <Link 
              to={user ? "/profile" : "/login"} 
              className="p-2 hover:bg-gray-100 rounded-full flex items-center space-x-1"
            >
              <User className="h-6 w-6" />
              <span className="hidden md:inline text-sm">
                {user ? 'Profile' : 'Login'}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}