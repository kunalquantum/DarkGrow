import {
  differenceInCalendarDays,
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from 'date-fns'

export function relativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true })
}

export function friendlyDate(isoDate: string): string {
  const date = new Date(isoDate)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMM d, yyyy')
}

export function groupLabel(isoDate: string): string {
  const date = new Date(isoDate)
  const diff = differenceInCalendarDays(new Date(), date)

  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return 'This week'
  if (diff < 30) return 'This month'
  return format(date, 'MMMM yyyy')
}

export function dayLabel(isoDate: string): string {
  return format(new Date(isoDate), 'EEEE, MMMM d')
}
