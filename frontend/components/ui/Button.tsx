import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-40 disabled:pointer-events-none";

  const variants = {
    primary:   "bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-sm hover:shadow-brand-600/30 hover:shadow-lg focus:ring-brand-500",
    secondary: "bg-surface-700 text-white hover:bg-surface-600 focus:ring-surface-500",
    outline:   "border border-white/10 bg-surface-800 text-gray-200 hover:bg-surface-700 hover:border-white/20 focus:ring-surface-500",
    ghost:     "bg-transparent text-gray-300 hover:bg-surface-700 hover:text-white focus:ring-surface-500",
    danger:    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};