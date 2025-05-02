import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale';
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
  transitionType = 'fade' 
}) => {
  const transitions = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    },
    slide: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 },
      transition: { duration: 0.3 }
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.95, opacity: 0 },
      transition: { duration: 0.3 }
    }
  };

  const selectedTransition = transitions[transitionType];

  return (
    <motion.div
      initial={selectedTransition.initial}
      animate={selectedTransition.animate}
      exit={selectedTransition.exit}
      transition={selectedTransition.transition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 