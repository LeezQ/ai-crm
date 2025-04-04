import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

export function formatDate(
  date: string | Date,
  formatStr: string = "YYYY/MM/DD"
): string {
  return dayjs(date).format(formatStr);
}

export function formatDateTime(date: string | Date): string {
  return dayjs(date).format("YYYY/MM/DD HH:mm");
}

export function formatDateRange(
  startDate: string | Date,
  endDate: string | Date
): string {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function getRelativeTime(date: string | Date): string {
  const now = dayjs();
  const dateObj = dayjs(date);
  const diff = now.diff(dateObj, "minute");

  if (diff < 1) {
    return "刚刚";
  }
  if (diff < 60) {
    return `${diff}分钟前`;
  }
  if (diff < 1440) {
    return `${Math.floor(diff / 60)}小时前`;
  }
  return `${Math.floor(diff / 1440)}天前`;
}

export function isToday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), "day");
}

export function isPast(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs());
}

export function isFuture(date: string | Date): boolean {
  return dayjs(date).isAfter(dayjs());
}

export function addDays(date: string | Date, days: number): Date {
  return dayjs(date).add(days, "day").toDate();
}

export function getStartOfDay(date: string | Date): Date {
  return dayjs(date).startOf("day").toDate();
}

export function getEndOfDay(date: string | Date): Date {
  return dayjs(date).endOf("day").toDate();
}
