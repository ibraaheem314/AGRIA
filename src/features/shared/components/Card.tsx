import React from 'react';
import { motion } from 'framer-motion';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'outline' | 'filled' | 'glass' | 'glow' | 'accent';
  interactive?: boolean;
  hoverable?: boolean;
  withHoverAnimation?: boolean;
  hoverAnimationType?: 'lift' | 'scale' | 'glow' | 'border';
  withInitialAnimation?: boolean;
  onClick?: () => void;
}

/**
 * Card component with multiple variants and animation options
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Visual style variant
 * @param {boolean} interactive - Whether card is clickable
 * @param {boolean} hoverable - Whether card should have hover styles
 * @param {boolean} withHoverAnimation - Whether to apply motion hover animation
 * @param {string} hoverAnimationType - Type of hover animation
 * @param {boolean} withInitialAnimation - Whether to animate on mount
 * @param {Function} onClick - Click handler
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  hoverable = false,
  withHoverAnimation = false,
  hoverAnimationType = 'lift',
  withInitialAnimation = false,
  onClick,
}) => {
  const Component = interactive || withHoverAnimation || withInitialAnimation ? motion.div : 'div';
  
  // Get CSS classes based on variant
  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20';
      case 'outline':
        return 'bg-transparent border border-primary/30';
      case 'filled':
        return 'bg-surface border border-surface-600/30';
      case 'glass':
        return 'bg-dark/40 backdrop-blur-md border border-white/10';
      case 'glow':
        return 'bg-surface border border-primary/30 shadow-glow-sm';
      case 'accent':
        return 'bg-primary/10 border border-primary/30';
      default:
        return 'bg-dark border border-dark-600/50';
    }
  };
  
  // Get hover animation props
  const getHoverAnimationProps = () => {
    if (!withHoverAnimation) return {};
    
    switch (hoverAnimationType) {
      case 'lift':
        return {
          whileHover: { y: -5 },
          whileTap: { y: 0 },
          transition: { duration: 0.2 }
        };
      case 'scale':
        return {
          whileHover: { scale: 1.02 },
          whileTap: { scale: 0.98 },
          transition: { duration: 0.2 }
        };
      case 'glow':
        return {
          whileHover: { 
            boxShadow: '0 0 15px rgba(42, 148, 80, 0.35)',
            borderColor: 'rgba(42, 148, 80, 0.5)'
          },
          transition: { duration: 0.2 }
        };
      case 'border':
        return {
          whileHover: { 
            borderColor: 'rgba(42, 148, 80, 0.8)',
          },
          transition: { duration: 0.2 }
        };
      default:
        return {};
    }
  };
  
  // Get initial animation props for appearing cards
  const getInitialAnimationProps = () => {
    if (!withInitialAnimation) return {};
    
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 }
    };
  };
  
  // Combine all props
  const motionProps = {
    ...getHoverAnimationProps(),
    ...getInitialAnimationProps(),
    onClick: interactive ? onClick : undefined,
  };
  
  // Combine all classes
  const cardClasses = cn(
    'rounded-xl overflow-hidden',
    getVariantClasses(),
    hoverable && 'hover:border-primary/50 transition-colors duration-200',
    interactive && 'cursor-pointer',
    className
  );

  return (
    <Component className={cardClasses} {...motionProps}>
      {children}
    </Component>
  );
};

export default Card; 