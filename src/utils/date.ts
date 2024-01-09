import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export function getTimeRelativeToNow(date: Date | string | number) {
  const dateObj = new Date(date)
  const now = new Date()

  if (
    now.getDate() === dateObj.getDate() &&
    now.getMonth() === dateObj.getMonth() &&
    now.getFullYear() === dateObj.getFullYear()
  ) {
    return dayjs(date).format('HH:mm')
  }

  if (now.getFullYear() === dateObj.getFullYear()) {
    return dayjs(date).format('MMM D')
  }

  return dayjs(date).format('MMM D, YYYY')
}

export function formatDate(date: number | string | Date) {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(dateObj)
}
