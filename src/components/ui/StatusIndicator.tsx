import React from 'react';
import { cn } from '@/lib/utils';

interface StatusLevel {
  value: number;
  label: string;
  color: string;
}

interface StatusIndicatorProps {
  value: string | number;
  levels: StatusLevel[];
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  value, 
  levels, 
  showValue = false,
  size = 'md',
  className = "" 
}) => {
  // Conversion de la valeur en nombre si c'est une chaîne
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Trouver le niveau approprié en fonction de la valeur
  const currentLevel = levels.find((level, index) => {
    const nextLevel = levels[index + 1];
    return nextLevel ? numericValue < nextLevel.value : true;
  }) || levels[levels.length - 1];

  // Size mappings
  const sizeMappings = {
    sm: {
      container: 'gap-1.5',
      dot: 'w-2 h-2',
      text: 'text-xs'
    },
    md: {
      container: 'gap-2',
      dot: 'w-3 h-3',
      text: 'text-sm'
    },
    lg: {
      container: 'gap-2.5',
      dot: 'w-4 h-4',
      text: 'text-base'
    }
  };

  return (
    <div className={cn("flex items-center", sizeMappings[size].container, className)}>
      <div className={cn(
        sizeMappings[size].dot, 
        "rounded-full shadow-md shadow-black/20",
        currentLevel.color
      )}>
        <span className="block w-full h-full animate-pulse-slow opacity-50 rounded-full" 
              style={{backgroundColor: currentLevel.color}} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={cn("font-medium text-white", sizeMappings[size].text)}>
          {currentLevel.label}
        </span>
        {showValue && (
          <span className="text-white/60 text-xs">
            {typeof value === 'number' ? value.toFixed(1) : value}
          </span>
        )}
      </div>
    </div>
  );
}; 