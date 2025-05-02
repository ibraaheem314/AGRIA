import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './Card';

interface TrendData {
  value: number;
  isPositive?: boolean;
  label?: string;
}

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  trend?: TrendData;
  description?: string;
  loading?: boolean;
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  color = 'primary',
  trend,
  description,
  loading = false,
  className = ''
}) => {
  // Determine color classes based on color prop
  const getColorClasses = () => {
    switch (color) {
      case 'success':
        return 'text-green-400 bg-green-500/10';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10';
      case 'danger':
        return 'text-red-400 bg-red-500/10';
      case 'info':
        return 'text-blue-400 bg-blue-500/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  // Prepare trend icon and colors
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.isPositive === undefined) {
      return <Minus size={14} className="text-gray-400" />;
    }
    
    return trend.isPositive ? (
      <ArrowUp size={14} className="text-green-400" />
    ) : (
      <ArrowDown size={14} className="text-red-400" />
    );
  };

  return (
    <Card 
      className={`${className} p-4 text-white overflow-visible bg-surface border border-primary/20 hover:border-primary/30 transition-colors`}
      withInitialAnimation
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {icon && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses()}`}>
            {icon}
          </div>
        )}
      </div>
      
      {/* Card content */}
      <div>
        {loading ? (
          <div className="h-8 bg-dark/50 rounded animate-pulse mb-2"></div>
        ) : (
          <div className="text-2xl font-bold mb-1">{value}</div>
        )}
        
        {/* Trend and description */}
        <div className="flex items-center text-xs text-text-secondary">
          {trend && (
            <div className="flex items-center mr-2">
              {getTrendIcon()}
              <span className={trend.isPositive ? 'text-green-400 ml-1' : 'text-red-400 ml-1'}>
                {trend.value}%
              </span>
              {trend.label && <span className="ml-1 text-text-tertiary">{trend.label}</span>}
            </div>
          )}
          
          {description && (
            <div className={`${loading ? 'bg-dark/50 h-3 w-24 rounded animate-pulse' : ''}`}>
              {!loading && description}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DataCard; 