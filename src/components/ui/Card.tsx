import React from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Fonction utilitaire pour combiner des classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'filled' | 'glass';
  interactive?: boolean;
  hoverable?: boolean;
  withHoverAnimation?: boolean;
  withInitialAnimation?: boolean;
  onClick?: () => void;
}

/**
 * Composant Card optimisé avec design minimaliste
 * 
 * @example
 * <Card>
 *   <h3>Basic Card</h3>
 *   <p>This is the content</p>
 * </Card>
 * 
 * <Card variant="outline" hoverable>
 *   <h3>Interactive Card</h3>
 *   <p>This card has hover effects</p>
 * </Card>
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  hoverable = false,
  withHoverAnimation = false,
  withInitialAnimation = false,
  onClick,
}) => {
  const baseStyles = 'rounded-lg overflow-hidden relative transition-all duration-200';

  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    outline: 'bg-transparent border border-gray-300 shadow-sm hover:shadow-md',
    filled: 'bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md',
    glass: 'backdrop-blur-lg bg-white/80 border border-gray-200 shadow-sm hover:shadow-md',
  };

  const interactiveStyles = interactive 
    ? 'cursor-pointer transition-all duration-300'
    : '';

  const hoverStyles = hoverable 
    ? 'hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5'
    : '';

  const getHoverAnimationProps = () => {
    if (!withHoverAnimation) return {};
    
    return {
      whileHover: { y: -2, transition: { duration: 0.2 } },
      whileTap: { y: 0, scale: 0.98 },
    };
  };

  const initialAnimationProps = withInitialAnimation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  } : {};

  return (
    <motion.div
      className={cn(baseStyles, variants[variant], interactiveStyles, hoverStyles, className)}
      onClick={onClick}
      {...getHoverAnimationProps()}
      {...initialAnimationProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;
