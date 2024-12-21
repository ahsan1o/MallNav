import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed top-20 left-4 z-10 flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-all duration-300"
    >
      <ArrowLeft className="h-5 w-5 text-indigo-600" />
      <span className="text-indigo-600 font-medium">Back</span>
    </button>
  );
}