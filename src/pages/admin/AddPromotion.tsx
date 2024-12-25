import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import type { Database } from '../../types/database';

type Shop = Database['public']['Tables']['shops']['Row'];

export function AddPromotion() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(10);
  const [shopId, setShopId] = useState('');
  const [validFrom, setValidFrom] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchShops() {
      try {
        const { data, error: fetchError } = await supabase
          .from('shops')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;
        setShops(data || []);
        if (data?.[0]) {
          setShopId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch shops'));
      }
    }

    fetchShops();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('promotions')
        .insert([
          {
            title,
            description,
            discount_percentage: discountPercentage,
            shop_id: shopId,
            valid_from: new Date(validFrom).toISOString(),
            valid_until: new Date(validUntil).toISOString()
          }
        ]);

      if (insertError) throw insertError;

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error adding promotion:', err);
      setError(err instanceof Error ? err : new Error('Failed to add promotion'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Tag className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Add New Promotion</h1>
        </div>

        <ErrorDisplay error={error} className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="shop" className="block text-sm font-medium text-gray-700">
              Shop
            </label>
            <select
              id="shop"
              value={shopId}
              onChange={(e) => setShopId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Promotion Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">
              Discount Percentage
            </label>
            <input
              type="number"
              id="discountPercentage"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(parseInt(e.target.value))}
              required
              min={1}
              max={100}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="validFrom" className="block text-sm font-medium text-gray-700">
                Valid From
              </label>
              <input
                type="date"
                id="validFrom"
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="validUntil" className="block text-sm font-medium text-gray-700">
                Valid Until
              </label>
              <input
                type="date"
                id="validUntil"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                required
                min={validFrom}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Promotion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}