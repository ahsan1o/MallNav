import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Shield, Building2, ShoppingBag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ErrorDisplay } from '../../components/ErrorDisplay';

type AdminRole = 'super_admin' | 'mall_admin' | 'shop_admin';

interface AdminUser {
  id: string;
  user_id: string;
  role: AdminRole;
  mall_id?: string | null;
  shop_id?: string | null;
  user_email?: string;
}

interface Mall {
  id: string;
  name: string;
}

interface Shop {
  id: string;
  name: string;
  mall_id: string;
}

export function AdminManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [malls, setMalls] = useState<Mall[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // New admin form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('mall_admin');
  const [selectedMallId, setSelectedMallId] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // Check if current user is super admin
      const { data: currentAdmin, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .single();

      if (adminError) throw adminError;
      if (currentAdmin.role !== 'super_admin') {
        throw new Error('Only super admins can access this page');
      }

      // Load all data in parallel
      const [adminsData, mallsData, shopsData] = await Promise.all([
        supabase
          .from('admin_users')
          .select(`
            *,
            auth.users (email)
          `),
        supabase
          .from('malls')
          .select('id, name')
          .order('name'),
        supabase
          .from('shops')
          .select('id, name, mall_id')
          .order('name')
      ]);

      if (adminsData.error) throw adminsData.error;
      if (mallsData.error) throw mallsData.error;
      if (shopsData.error) throw shopsData.error;

      setAdmins(adminsData.data || []);
      setMalls(mallsData.data || []);
      setShops(shopsData.data || []);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError(err instanceof Error ? err : new Error('Failed to load admin data'));
    } finally {
      setLoading(false);
    }
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setFormError(null);
      setLoading(true);

      // First check if user exists
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', email)
        .single();

      if (userError) {
        throw new Error('User not found. Please ensure the email is correct.');
      }

      // Create admin user
      const { error: createError } = await supabase
        .from('admin_users')
        .insert([{
          user_id: userData.id,
          role,
          mall_id: role === 'mall_admin' ? selectedMallId : null,
          shop_id: role === 'shop_admin' ? selectedShopId : null
        }]);

      if (createError) throw createError;

      // Reset form and reload data
      setEmail('');
      setRole('mall_admin');
      setSelectedMallId('');
      setSelectedShopId('');
      await loadData();
    } catch (err) {
      console.error('Error adding admin:', err);
      setFormError(err instanceof Error ? err.message : 'Failed to add admin');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            Admin Management
          </h1>
        </div>

        {error && <ErrorDisplay error={error} className="mb-6" />}

        {/* Add Admin Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <UserPlus className="h-5 w-5 text-indigo-600 mr-2" />
            Add New Admin
          </h2>

          {formError && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="super_admin">Super Admin</option>
                <option value="mall_admin">Mall Admin</option>
                <option value="shop_admin">Shop Admin</option>
              </select>
            </div>

            {role === 'mall_admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mall
                </label>
                <select
                  value={selectedMallId}
                  onChange={(e) => setSelectedMallId(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a mall</option>
                  {malls.map((mall) => (
                    <option key={mall.id} value={mall.id}>
                      {mall.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {role === 'shop_admin' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Shop
                </label>
                <select
                  value={selectedShopId}
                  onChange={(e) => setSelectedShopId(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a shop</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Admin'}
              </button>
            </div>
          </form>
        </div>

        {/* Admin List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Admins</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assignment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.mall_id && (
                        <span className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {malls.find(m => m.id === admin.mall_id)?.name}
                        </span>
                      )}
                      {admin.shop_id && (
                        <span className="flex items-center">
                          <ShoppingBag className="h-4 w-4 mr-1" />
                          {shops.find(s => s.id === admin.shop_id)?.name}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to remove this admin?')) {
                            try {
                              const { error } = await supabase
                                .from('admin_users')
                                .delete()
                                .eq('id', admin.id);
                              
                              if (error) throw error;
                              await loadData();
                            } catch (err) {
                              console.error('Error removing admin:', err);
                              setError(err instanceof Error ? err : new Error('Failed to remove admin'));
                            }
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}