/**
 * Formate un nombre pour l'affichage avec un nombre fixe de décimales
 * Gère les cas où la valeur pourrait être une chaîne ou non définie
 */
export function formatNumber(value: any, decimals: number = 1): string {
  if (value === undefined || value === null) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  return num.toFixed(decimals);
}

/**
 * Formate un nombre pour l'affichage sans décimales (entier arrondi)
 * Gère les cas où la valeur pourrait être une chaîne ou non définie
 */
export function formatInteger(value: any): string {
  if (value === undefined || value === null) return '0';
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return '0';
  
  return Math.round(num).toString();
}

/**
 * Limite une valeur à un maximum pour les affichages en pourcentage
 */
export function limitPercentage(value: any, max: number = 100): number {
  if (value === undefined || value === null) return 0;
  
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(num)) return 0;
  
  return Math.min(num, max);
}

/**
 * Convert timestamp to local time string
 */
export function formatTime(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format date to localized string
 */
export function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit'
  });
} 