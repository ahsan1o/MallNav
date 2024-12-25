import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
  className?: string;
}

export function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  console.error('Application error:', error);

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{error.message}</p>
            {process.env.NODE_ENV === 'development' && error.stack && (
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}