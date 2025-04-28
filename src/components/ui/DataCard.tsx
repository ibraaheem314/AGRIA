import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Card from './Card';

// Fonction utilitaire pour combiner des classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive?: boolean;
    label?: string;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  footer?: ReactNode;
  loading?: boolean;
  description?: string;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  highlight?: boolean;
  actions?: ReactNode;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'default',
  footer,
  loading = false,
  description,
  onClick,
  className = '',
  size = 'md',
  highlight = false,
  actions
}) => {
  // Couleur d'accentuation en fonction du type
  const colorStyles = {
    primary: 'text-primary border-primary/20',
    secondary: 'text-secondary border-secondary/20',
    success: 'text-success border-success/20',
    warning: 'text-warning border-warning/20',
    danger: 'text-danger border-danger/20',
    info: 'text-info border-info/20',
    default: 'text-text-secondary border-border'
  };

  // Styles en fonction de la taille
  const sizeStyles = {
    sm: {
      card: 'p-3',
      title: 'text-xs',
      value: 'text-xl font-bold',
      icon: 'h-5 w-5'
    },
    md: {
      card: 'p-4',
      title: 'text-sm',
      value: 'text-2xl font-bold',
      icon: 'h-6 w-6'
    },
    lg: {
      card: 'p-5',
      title: 'text-base',
      value: 'text-3xl font-bold',
      icon: 'h-7 w-7'
    }
  };

  // Gestion du trend (variation)
  const renderTrend = () => {
    if (!trend) return null;
    
    const { value: trendValue, isPositive = trendValue >= 0, label } = trend;
    const formattedValue = `${isPositive ? '+' : ''}${trendValue}%`;
    const trendColor = isPositive ? 'text-success' : 'text-danger';
    
    return (
      <div className={`flex items-center text-xs ${trendColor}`}>
        {isPositive ? (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L19 12L12 19M5 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 19L5 12L12 5M19 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <span>{formattedValue}</span>
        {label && <span className="ml-1 text-text-tertiary">{label}</span>}
      </div>
    );
  };

  return (
    <Card 
      variant={highlight ? 'accent' : 'default'}
      className={cn(
        sizeStyles[size].card,
        highlight ? 'border-l-4' : '',
        highlight ? colorStyles[color].split(' ')[1] : '',
        'relative',
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
      hoverable={!!onClick}
      withHoverAnimation={!!onClick}
    >
      {loading ? (
        <>
          <div className="flex justify-between items-start mb-2">
            <div className="h-4 w-20 skeleton-loading rounded"></div>
            <div className="h-6 w-6 skeleton-loading rounded-full"></div>
          </div>
          <div className="h-8 w-24 skeleton-loading rounded mb-2"></div>
          <div className="h-4 w-32 skeleton-loading rounded"></div>
        </>
      ) : (
        <>
          <div className="flex justify-between items-start mb-2">
            <h3 className={`font-medium text-text-secondary ${sizeStyles[size].title}`}>{title}</h3>
            
            {actions && (
              <div className="ml-auto">{actions}</div>
            )}
            
            {icon && (
              <div className={cn("ml-2 flex-shrink-0", colorStyles[color].split(' ')[0])}>
                {React.cloneElement(icon as React.ReactElement, {
                  className: sizeStyles[size].icon
                })}
              </div>
            )}
          </div>
          
          <div className="flex items-end space-x-2 mb-1">
            <div className={`${sizeStyles[size].value} ${colorStyles[color].split(' ')[0]}`}>
              {value}
            </div>
            {renderTrend()}
          </div>
          
          {description && <p className="text-xs text-text-tertiary">{description}</p>}
          
          {footer && (
            <div className="mt-3 pt-3 border-t border-border text-sm">
              {footer}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default DataCard; 