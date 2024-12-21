import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { title: 'Add New Mall', path: '/admin/malls/new' },
    { title: 'Add New Shop', path: '/admin/shops/new' },
    { title: 'Add New Promotion', path: '/admin/promotions/new' }
  ];

  return (
    <div className="mt-8 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {actions.map(({ title, path }) => (
        <button
          key={title}
          onClick={() => navigate(path)}
          className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <span className="mt-2 block text-sm font-medium text-gray-900">
            {title}
          </span>
        </button>
      ))}
    </div>
  );
}