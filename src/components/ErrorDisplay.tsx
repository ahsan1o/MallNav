import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
  className?: string;
}

export function ErrorDisplay({ error, className = '' }: ErrorDisplayProps) {
  if (!error) return null;

  // Convert technical error messages to user-friendly ones
  const getUserFriendlyMessage = (error: Error) => {
    const message = error.message.toLowerCase();
    
    // Database connection errors
    if (message.includes('network') || message.includes('connection')) {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    // Authentication errors
    if (message.includes('authentication') || message.includes('auth')) {
      return 'There was a problem with your login credentials. Please try again.';
    }
    
    // Permission errors
    if (message.includes('permission') || message.includes('access denied')) {
      return 'You don\'t have permission to perform this action. Please contact support if you think this is a mistake.';
    }
    
    // Data not found
    if (message.includes('not found')) {
      return 'The requested information could not be found. Please try again or contact support.';
    }
    
    // Validation errors
    if (message.includes('validation') || message.includes('invalid')) {
      return 'Please check your input and try again.';
    }
    
    // Default error message
    return 'Something went wrong. Please try again or contact support if the problem persists.';
  };

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-1 text-sm text-red-700">
            <p>{getUserFriendlyMessage(error)}</p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-2 text-xs bg-red-50 p-2 rounded overflow-auto">
                Original error: {error.message}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}