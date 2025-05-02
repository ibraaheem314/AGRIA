import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default' | 'subtle';
  size?: 'sm' | 'md';
  pill?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

/**
 * Badge component for displaying statuses and small informational indicators
 * 
 * @example
 * <Badge variant="success">Completed</Badge>
 * <Badge variant="warning" icon={<AlertIcon />}>Warning</Badge>
 */
const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  pill = false,
  className = '',
  icon
}) => {
  const variantClasses = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    default: 'bg-white/10 text-white border border-white/10',
    subtle: 'bg-neutral-800/50 text-gray-300 border border-neutral-700',
  };

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-2.5',
  };

  const radiusClass = pill ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`inline-flex items-center font-medium ${sizeClasses[size]} ${radiusClass} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="mr-1.5 -ml-0.5">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
