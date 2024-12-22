import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Database } from '../types/database';

type Promotion = Database['public']['Tables']['promotions']['Row'] & {
  shop: Database['public']['Tables']['shops']['Row']
};

interface PromotionalBannerProps {
  promotion: Promotion | null;
}

export function PromotionalBanner({ promotion }: PromotionalBannerProps) {
  if (!promotion?.shop) return null;

  return (
    <Link
      to={`/shops/${promotion.shop.id}`}
      className="group block bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl overflow-hidden shadow-lg mb-8 hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        <img
          src={promotion.shop.image_url || ''}
          alt={promotion.shop.name}
          className="w-full h-48 object-cover opacity-25"
        />
        <div className="absolute inset-0 p-6 text-white">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-5 w-5" />
                <span className="font-bold text-xl">{promotion.discount_percentage}% OFF</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{promotion.title}</h3>
              <p className="text-indigo-100">{promotion.description}</p>
              <p className="text-sm text-indigo-200 mt-2">
                at {promotion.shop.name}
              </p>
            </div>
            <ArrowRight className="h-6 w-6 transform group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}