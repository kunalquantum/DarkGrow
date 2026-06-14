import {
  formatDistanceToNow,
  format,
  isToday,
  isYesterday,
  isThisYear,
} from "date-fns";

export function relativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function friendlyDate(date: string | Date): string {
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, isThisYear(d) ? "MMM d" : "MMM d, yyyy");
}

export function groupLabel(date: string | Date): string {
  return format(new Date(date), "MMMM yyyy");
}

export function dayLabel(date: string | Date): string {
  return format(new Date(date), "EEEE, MMM d");
}
