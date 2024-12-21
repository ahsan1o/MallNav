import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShoppingBag, User, Bell } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <MapPin className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">MallNav</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/shops" className="p-2 hover:bg-gray-100 rounded-full">
              <ShoppingBag className="h-6 w-6" />
            </Link>
            <Link to="/notifications" className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-6 w-6" />
            </Link>
            <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}