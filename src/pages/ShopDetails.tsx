import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Map } from '../components/Map';
import { Map3D } from '../components/Map3D';
import { useShop } from '../hooks/useShop';
import { Clock, Phone, Globe, MapPin, Tag } from 'lucide-react';

export function ShopDetails() {
  const { id } = useParams<{ id: string }>();
  const { shop, promotions, loading, error } = useShop(id!);
  const [view, setView] = React.useState<'2d' | '3d'>('2d');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="text-center text-red-600">
        Failed to load shop details. Please try again later.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/shops" className="text-indigo-600 hover:text-indigo-700">
          ← Back to Shops
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={shop.image_url || ''}
            alt={shop.name}
            className="w-full h-64 object-cover rounded-lg shadow-lg"
          />
          
          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-900">{shop.name}</h1>
            <p className="mt-2 text-gray-600">{shop.description}</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>Floor {shop.floor}</span>
              </div>
              {shop.contact_info && (
                <>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="h-5 w-5" />
                    <span>{(shop.contact_info as any).phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="h-5 w-5" />
                    <a
                      href={(shop.contact_info as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      Visit Website
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>

          {promotions.length > 0 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Current Promotions
              </h2>
              <div className="space-y-4">
                {promotions.map((promo) => (
                  <div
                    key={promo.id}
                    className="border-l-4 border-green-500 pl-4 py-2"
                  >
                    <h3 className="font-semibold">{promo.title}</h3>
                    <p className="text-gray-600">{promo.description}</p>
                    <p className="text-green-600 font-medium">
                      {promo.discount_percentage}% OFF
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Location</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setView('2d')}
                  className={`px-3 py-1 rounded ${
                    view === '2d'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setView('3d')}
                  className={`px-3 py-1 rounded ${
                    view === '3d'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  3D
                </button>
              </div>
            </div>
            {view === '2d' ? (
              <Map shops={[shop]} selectedShop={shop} />
            ) : (
              <Map3D shops={[shop]} onShopSelect={() => {}} />
            )}
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <MapPin className="h-5 w-5 mr-2" />
            Navigate to Shop
          </button>
        </div>
      </div>
    </div>
  );
}