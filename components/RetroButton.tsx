import React from 'react';

interface RetroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'warning' | 'neutral';
  label: string;
}

export const RetroButton: React.FC<RetroButtonProps> = ({ variant = 'primary', label, className = '', ...props }) => {
  let colorClasses = 'border-retro-green text-retro-green hover:bg-retro-green hover:text-black active:bg-retro-green-dim';
  
  if (variant === 'danger') {
    colorClasses = 'border-retro-red text-retro-red hover:bg-retro-red hover:text-black active:bg-red-800';
  } else if (variant === 'warning') {
    colorClasses = 'border-retro-amber text-retro-amber hover:bg-retro-amber hover:text-black active:bg-yellow-800';
  } else if (variant === 'neutral') {
    colorClasses = 'border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-black active:bg-gray-700';
  }

  return (
    <button
      className={`
        font-pixel text-xs sm:text-sm uppercase py-3 px-4 sm:px-6 
        border-2 sm:border-4 rounded-sm transition-colors duration-100
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-current
        ${colorClasses}
        ${className}
      `}
      {...props}
    >
      {label}
    </button>
  );
};