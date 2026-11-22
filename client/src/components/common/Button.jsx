import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow active:bg-indigo-700',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white',
  outline: 'bg-transparent border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs font-medium rounded-lg',
  md: 'px-4 py-2 text-sm font-medium rounded-lg',
  lg: 'px-5 py-2.5 text-base font-semibold rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
