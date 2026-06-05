import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 border border-blue-600 shadow-sm',
  secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 border border-transparent',
  danger: 'bg-red-500 text-white hover:bg-red-600 border border-red-500 shadow-sm',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 border border-emerald-500 shadow-sm',
  warning: 'bg-amber-500 text-white hover:bg-amber-600 border border-amber-500 shadow-sm',
  info: 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-xl
          transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          active:scale-95
          ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}
        `}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';