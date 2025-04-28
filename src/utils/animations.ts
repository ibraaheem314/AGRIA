/**
 * Collection of standard animation variants for use with framer-motion
 * throughout the application
 */

// Fade in animation (standard)
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 }
};

// Fade in from bottom
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5 }
};

// Fade in from left
export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.5 }
};

// Scale animation
export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.5 }
};

// Staggered children animation
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// For use with staggerContainer
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Button hover animation
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.98 }
};

// List item hover
export const listItemHover = {
  whileHover: { x: 5, transition: { duration: 0.2 } }
};

// Card hover animation
export const cardHover = {
  whileHover: { y: -5, transition: { duration: 0.3 } },
  whileTap: { y: 0, scale: 0.98 }
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Utility function to create staggered delays for elements in a list
export const getStaggeredDelay = (index: number, baseDelay: number = 0.1) => {
  return { delay: index * baseDelay };
};

// Function to generate viewport animation - useful for scroll-triggered animations
export const createScrollAnimation = (animation: any, once: boolean = true) => {
  return {
    ...animation,
    viewport: { once, amount: 0.3 }
  };
}; 