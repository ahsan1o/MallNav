import React from 'react';
import { Building2, ShoppingBag, Users, Tag } from 'lucide-react';

interface DashboardStatsProps {
  totalMalls: number;
  totalShops: number;
  totalUsers: number;
  activePromotions: number;
}

export function DashboardStats({
  totalMalls,
  totalShops,
  totalUsers,
  activePromotions
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Building2 className="h-6 w-6 text-gray-400" />}
        title="Total Malls"
        value={totalMalls}
      />
      <StatCard
        icon={<ShoppingBag className="h-6 w-6 text-gray-400" />}
        title="Total Shops"
        value={totalShops}
      />
      <StatCard
        icon={<Users className="h-6 w-6 text-gray-400" />}
        title="Total Users"
        value={totalUsers}
      />
      <StatCard
        icon={<Tag className="h-6 w-6 text-gray-400" />}
        title="Active Promotions"
        value={activePromotions}
      />
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
}

function StatCard({ icon, title, value }: StatCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}