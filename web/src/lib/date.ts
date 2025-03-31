import { format, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatDate(
  date: string | Date,
  formatStr: string = "yyyy-MM-dd"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatStr, { locale: zhCN });
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, "yyyy-MM-dd HH:mm");
}

export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date
): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const diff = now.getTime() - dateObj.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}天前`;
  }
  if (hours > 0) {
    return `${hours}小时前`;
  }
  if (minutes > 0) {
    return `${minutes}分钟前`;
  }
  return "刚刚";
}

export function isToday(date: string | Date): boolean {
  const today = new Date();
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

export function isPast(date: string | Date): boolean {
  const now = new Date();
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj < now;
}

export function isFuture(date: string | Date): boolean {
  return !isPast(date);
}

export function addDays(date: string | Date, days: number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
}

export function getStartOfDay(date: string | Date): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function getEndOfDay(date: string | Date): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const result = new Date(dateObj);
  result.setHours(23, 59, 59, 999);
  return result;
}
