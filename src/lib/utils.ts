import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine multiple class names with Tailwind CSS classes, resolving conflicts
 * 
 * @param inputs Array of class values to combine
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number to a human-readable string with commas as thousands separators
 * 
 * @param num Number to format
 * @returns Formatted number as string
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a number to currency format
 */
export function formatCurrency(value: number, locale = 'fr-FR', currency = 'EUR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format a date to localized string
 */
export function formatDate(date: Date | string, locale = 'fr-FR') {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate a string to a specified length and add ellipsis
 * 
 * @param str String to truncate
 * @param length Maximum length before truncation
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Convert a date to a relative time string (e.g., "2 hours ago")
 * 
 * @param dateString Date string or Date object
 * @returns Relative time string
 */
export function timeAgo(dateString: string | Date): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Time intervals in seconds
  const intervals = {
    année: 31536000,
    mois: 2592000,
    semaine: 604800,
    jour: 86400,
    heure: 3600,
    minute: 60,
    seconde: 1
  };

  // Handle future dates
  if (seconds < 0) {
    return "dans le futur";
  }

  // Find the appropriate interval
  let counter;
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    counter = Math.floor(seconds / secondsInUnit);
    if (counter > 0) {
      if (unit === 'jour' && counter === 1) return "hier";
      if (counter === 1) {
        return `il y a 1 ${unit}`;
      } else {
        // Handle plural forms
        const unitPlural = unit === 'mois' ? 'mois' : `${unit}s`;
        return `il y a ${counter} ${unitPlural}`;
      }
    }
  }

  return "à l'instant";
}

/**
 * Debounce a function call
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

/**
 * Generate a random ID
 */
export function generateId(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
} 