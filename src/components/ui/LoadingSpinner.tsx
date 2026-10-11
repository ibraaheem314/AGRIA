import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text = 'Chargement...'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className={cn(
            'border-2 border-gray-300 border-t-gray-900 rounded-full',
            sizeClasses[size]
          )}
        />
        {text && (
          <span className="text-sm text-gray-600 font-medium">{text}</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 