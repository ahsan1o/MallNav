import React from 'react';
import { MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];
type Promotion = Database['public']['Tables']['promotions']['Row'];

interface ShopCardProps {
  shop: Shop;
  promotions?: Promotion[];
}

export function ShopCard({ shop, promotions = [] }: ShopCardProps) {
  const activePromotions = promotions.filter(
    p => new Date(p.valid_until) > new Date()
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={shop.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'} 
        alt={shop.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{shop.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{shop.description}</p>
        
        {activePromotions.length > 0 && (
          <div className="mt-3">
            <div className="flex items-center space-x-1 text-green-600">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">
                Up to {Math.max(...activePromotions.map(d => d.discount_percentage || 0))}% off
              </span>
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/shops/${shop.id}`}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View Details
          </Link>
          <div className="flex items-center space-x-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Floor {shop.floor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}