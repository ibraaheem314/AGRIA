import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionType?: 'fade' | 'slide' | 'scale' | 'none';
}

/**
 * Page transition component for smooth transitions between routes
 * 
 * @example
 * <PageTransition>
 *   {children}
 * </PageTransition>
 */
const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  transitionType = 'fade'
}) => {
  // Animation variants for different transition types
  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    slide: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.05 },
    },
    none: {
      initial: {},
      animate: {},
      exit: {},
    }
  };

  const selectedVariant = variants[transitionType];
  
  return (
    <motion.div
      initial={selectedVariant.initial}
      animate={selectedVariant.animate}
      exit={selectedVariant.exit}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 