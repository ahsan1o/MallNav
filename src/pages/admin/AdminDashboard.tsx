import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminNav } from '../../components/admin/AdminNav';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { QuickActions } from '../../components/admin/QuickActions';

interface DashboardStats {
  totalMalls: number;
  totalShops: number;
  totalUsers: number;
  activePromotions: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMalls: 0,
    totalShops: 0,
    totalUsers: 0,
    activePromotions: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: mallCount },
          { count: shopCount },
          { count: userCount },
          { count: promoCount }
        ] = await Promise.all([
          supabase.from('malls').select('*', { count: 'exact' }),
          supabase.from('shops').select('*', { count: 'exact' }),
          supabase.from('user_profiles').select('*', { count: 'exact' }),
          supabase.from('promotions').select('*', { count: 'exact' })
        ]);

        setStats({
          totalMalls: mallCount || 0,
          totalShops: shopCount || 0,
          totalUsers: userCount || 0,
          activePromotions: promoCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav onSignOut={handleSignOut} />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <DashboardStats {...stats} />
          <QuickActions />
        </div>
      </main>
    </div>
  );
}