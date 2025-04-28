import React from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction utilitaire pour combiner des classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  rounded?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  disabled = false,
  fullWidth = false,
  loading = false,
  rounded = false,
  type = 'button',
  onClick
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background dark:focus:ring-offset-background';

  const variants = {
    primary: 'bg-primary hover:bg-primary-600 text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary-600 text-white focus:ring-secondary',
    outline: 'border border-border hover:border-primary-500 hover:text-primary text-text-secondary focus:ring-primary',
    ghost: 'bg-transparent hover:bg-surface-2 text-text-secondary focus:ring-primary',
    danger: 'bg-danger hover:bg-danger/90 text-white focus:ring-danger',
    success: 'bg-success hover:bg-success/90 text-white focus:ring-success',
    warning: 'bg-warning hover:bg-warning/90 text-black focus:ring-warning',
    info: 'bg-info hover:bg-info/90 text-white focus:ring-info',
    light: 'bg-surface-2 hover:bg-surface-3 text-text focus:ring-surface-3',
    dark: 'bg-surface-3 hover:bg-surface-2 text-text-secondary focus:ring-surface-3',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-lg';
  const widthStyles = fullWidth ? 'w-full' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer';
  const loadingStyles = loading ? 'relative !text-transparent' : '';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={cn(
        baseStyles, 
        variants[variant], 
        sizes[size], 
        roundedStyles,
        widthStyles,
        disabledStyles,
        loadingStyles,
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && !loading && <span className="ml-2">{icon}</span>}
    </motion.button>
  );
};

export default Button;
