// Utility functions for time calculations

/**
 * Calculate hours between two dates
 * @param startTime Start date/time
 * @param endTime End date/time
 * @returns Number of hours (with decimals)
 */
export function calculateHours(startTime: Date, endTime: Date): number {
  const diffInMs = endTime.getTime() - startTime.getTime();
  return diffInMs / (1000 * 60 * 60); // Convert milliseconds to hours
}

/**
 * Format hours to display format (e.g., "8.5 hours" or "8h 30m")
 * @param hours Number of hours
 * @param format Format type
 * @returns Formatted string
 */
export function formatHours(hours: number, format: 'decimal' | 'hm' = 'decimal'): string {
  if (format === 'hm') {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (minutes === 0) {
      return `${wholeHours}h`;
    }
    return `${wholeHours}h ${minutes}m`;
  }
  
  return `${hours.toFixed(1)} hours`;
}

/**
 * Format date and time for display
 * @param date Date to format
 * @param includeSeconds Whether to include seconds
 * @returns Formatted date string
 */
export function formatDateTime(date: Date, includeSeconds: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format time only for display
 * @param date Date to format
 * @param includeSeconds Whether to include seconds
 * @returns Formatted time string
 */
export function formatTime(date: Date, includeSeconds: boolean = false): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  
  return date.toLocaleTimeString('en-US', options);
}

/**
 * Get date range for the last N days
 * @param days Number of days to go back
 * @returns Object with start and end dates
 */
export function getDateRange(days: number): { startDate: Date; endDate: Date } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  return { startDate, endDate };
}

/**
 * Check if a date is today
 * @param date Date to check
 * @returns true if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

/**
 * Get the start and end of a day
 * @param date Date to get day boundaries for
 * @returns Object with start and end of day
 */
export function getDayBoundaries(date: Date): { startOfDay: Date; endOfDay: Date } {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return { startOfDay, endOfDay };
}