/**
 * Duration Formatting Utilities
 *
 * Helpers for displaying time durations in various formats.
 */

/**
 * Format minutes into "Xh Ym" format
 * Examples: 90 -> "1h 30m", 45 -> "45m", 120 -> "2h"
 */
export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Format minutes into decimal hours
 * Examples: 90 -> "1.5h", 45 -> "0.75h"
 */
export function formatDecimalHours(minutes: number): string {
  if (!minutes || minutes <= 0) return '0h';
  const hours = minutes / 60;
  return `${hours.toFixed(2)}h`;
}

/**
 * Format seconds into "HH:MM:SS" timer format
 * Examples: 3661 -> "01:01:01", 90 -> "00:01:30"
 */
export function formatTimer(seconds: number): string {
  if (!seconds || seconds < 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0'),
  ].join(':');
}

/**
 * Format seconds into compact timer format (no leading zeros for hours)
 * Examples: 3661 -> "1:01:01", 90 -> "1:30", 30 -> "0:30"
 */
export function formatTimerCompact(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a date range for time entries
 * Examples: "Today", "Yesterday", "Mon, Apr 28", "Apr 21 - Apr 28"
 */
export function formatDateRange(startDate: Date, endDate?: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  if (start.getTime() === today.getTime()) {
    return 'Today';
  }

  if (start.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };

  if (!endDate || start.getTime() === new Date(endDate).setHours(0, 0, 0, 0)) {
    return start.toLocaleDateString('en-US', formatOptions);
  }

  const end = new Date(endDate);
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `${startStr} - ${endStr}`;
}

/**
 * Format time of day from ISO timestamp
 * Example: "2:30 PM"
 */
export function formatTimeOfDay(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a time range
 * Example: "2:30 PM - 4:45 PM"
 */
export function formatTimeRange(startTime: string, endTime: string | null): string {
  const start = formatTimeOfDay(startTime);

  if (!endTime) {
    return `${start} - now`;
  }

  const end = formatTimeOfDay(endTime);
  return `${start} - ${end}`;
}

/**
 * Get relative time description
 * Examples: "just now", "5 minutes ago", "2 hours ago"
 */
export function getRelativeTime(isoTimestamp: string): string {
  const now = new Date();
  const date = new Date(isoTimestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return 'just now';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}
