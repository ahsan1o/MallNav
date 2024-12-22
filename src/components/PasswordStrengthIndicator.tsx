import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getStrength = (password: string): { strength: string; color: string } => {
    if (!password) return { strength: '', color: 'bg-gray-200' };
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const length = password.length;

    const conditions = [hasLower, hasUpper, hasNumber, hasSpecial, length >= 8];
    const passedConditions = conditions.filter(Boolean).length;

    if (passedConditions <= 2) return { strength: 'Weak', color: 'bg-red-500' };
    if (passedConditions <= 3) return { strength: 'Medium', color: 'bg-yellow-500' };
    if (passedConditions <= 4) return { strength: 'Strong', color: 'bg-green-500' };
    return { strength: 'Very Strong', color: 'bg-green-700' };
  };

  const { strength, color } = getStrength(password);

  if (!strength) return null;

  return (
    <div className="mt-1">
      <div className="flex items-center space-x-2">
        <div className={`h-2 flex-grow rounded ${color}`}></div>
        <span className="text-sm text-gray-600">{strength}</span>
      </div>
      <ul className="mt-2 text-xs text-gray-500 space-y-1">
        <li className={password.length >= 8 ? 'text-green-600' : ''}>
          • At least 8 characters
        </li>
        <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
          • At least one uppercase letter
        </li>
        <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
          • At least one lowercase letter
        </li>
        <li className={/\d/.test(password) ? 'text-green-600' : ''}>
          • At least one number
        </li>
        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : ''}>
          • At least one special character
        </li>
      </ul>
    </div>
  );
}