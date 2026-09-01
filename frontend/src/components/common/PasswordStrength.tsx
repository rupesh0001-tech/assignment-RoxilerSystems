import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const hasLength = password.length >= 8 && password.length <= 16;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const rules = [
    { label: '8 to 16 characters in length', met: hasLength },
    { label: 'At least one uppercase letter (A-Z)', met: hasUpper },
    { label: 'At least one special character (!@#$%^&*)', met: hasSpecial },
  ];

  if (!password) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-1.5 text-xs">
      <p className="font-semibold text-gray-700 mb-1">Password Requirements:</p>
      {rules.map((rule, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 transition-colors ${
            rule.met ? 'text-green-700 font-medium' : 'text-gray-500'
          }`}
        >
          {rule.met ? (
            <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
          ) : (
            <X className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          )}
          <span>{rule.label}</span>
        </div>
      ))}
    </div>
  );
};
