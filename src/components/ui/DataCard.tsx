import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Card from './Card';

interface TrendProps {
  value: number;
  isPositive: boolean;
  label?: string;
}

interface DataCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  trend?: TrendProps;
  description?: string;
  loading?: boolean;
}

const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  description,
  loading = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'secondary':
        return 'text-secondary bg-secondary/10 border-secondary/20';
      case 'success':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'info':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const iconClasses = `${getColorClasses()} p-3 rounded-lg`;

  return (
    <Card className="p-5 border border-primary/20 bg-surface hover:shadow-glow-sm transition-all duration-300">
      {loading ? (
        <div className="space-y-3">
          <div className="w-2/3 h-5 bg-primary/5 rounded animate-pulse"></div>
          <div className="w-1/2 h-8 bg-primary/5 rounded animate-pulse"></div>
          <div className="w-full h-4 bg-primary/5 rounded animate-pulse"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            <div className={iconClasses}>
              {icon}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-2xl font-bold">{value}</div>
            
            {trend && (
              <div className="flex items-center mt-1">
                <div className={`flex items-center ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.isPositive ? (
                    <ArrowUp size={14} className="mr-1" />
                  ) : (
                    <ArrowDown size={14} className="mr-1" />
                  )}
                  <span className="text-xs font-medium">{trend.value}%</span>
                </div>
                {trend.label && (
                  <span className="text-xs text-text-tertiary ml-1">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          
          {description && (
            <div className="text-xs text-text-tertiary">{description}</div>
          )}
        </>
      )}
    </Card>
  );
};

export default DataCard; 