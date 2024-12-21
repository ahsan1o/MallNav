import React from 'react';
import { Shield, LogOut } from 'lucide-react';

interface AdminNavProps {
  onSignOut: () => void;
}

export function AdminNav({ onSignOut }: AdminNavProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-indigo-600" />
            <span className="ml-2 text-xl font-semibold">Admin Portal</span>
          </div>
          <button
            onClick={onSignOut}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}