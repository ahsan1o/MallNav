import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ErrorDisplay } from '../../components/ErrorDisplay';
import type { Database } from '../../types/database';

type Mall = Database['public']['Tables']['malls']['Row'];
type ShopCategory = Database['public']['Tables']['shops']['Row']['category'];

const CATEGORIES: ShopCategory[] = [
  'Fashion',
  'Electronics',
  'Food & Beverages',
  'Sports & Fitness',
  'Beauty & Health',
  'Books & Gifts',
  'Home & Living',
  'Entertainment'
];

export function AddShop() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ShopCategory>('Fashion');
  const [floor, setFloor] = useState(1);
  const [mallId, setMallId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [malls, setMalls] = useState<Mall[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMalls() {
      try {
        const { data, error: fetchError } = await supabase
          .from('malls')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;
        setMalls(data || []);
        if (data?.[0]) {
          setMallId(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching malls:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch malls'));
      }
    }

    fetchMalls();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // First check if we have admin access
      const { data: adminCheck, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .single();

      if (adminError) {
        throw new Error('You do not have permission to add shops');
      }

      const { error: insertError } = await supabase
        .from('shops')
        .insert([
          {
            name,
            description,
            category,
            floor,
            mall_id: mallId,
            image_url: imageUrl,
            coordinates: { lat: 0, lng: 0 },
            position_3d: { x: 0, y: 0, z: 0 }
          }
        ]);

      if (insertError) throw insertError;

      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Error adding shop:', err);
      setError(err instanceof Error ? err : new Error('Failed to add shop'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-6">
          <ShoppingBag className="h-6 w-6 text-indigo-600 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Add New Shop</h1>
        </div>

        <ErrorDisplay error={error} className="mb-6" />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mall" className="block text-sm font-medium text-gray-700">
              Mall
            </label>
            <select
              id="mall"
              value={mallId}
              onChange={(e) => setMallId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a mall</option>
              {malls.map((mall) => (
                <option key={mall.id} value={mall.id}>
                  {mall.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Shop Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ShopCategory)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
                Floor
              </label>
              <input
                type="number"
                id="floor"
                value={floor}
                onChange={(e) => setFloor(parseInt(e.target.value))}
                required
                min={1}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
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
              {loading ? 'Adding...' : 'Add Shop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}