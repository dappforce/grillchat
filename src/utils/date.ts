import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
]
export function getTimeRelativeToNow(
  date: Date | string | number,
  config: { locale?: string } = { locale: 'en-US' }
) {
  const formatter = new Intl.RelativeTimeFormat(config.locale)
  let duration = (new Date(date).getTime() - new Date().getTime()) / 1000

  if (duration > -60) {
    return 'just now'
  }

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i]
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name)
    }
    duration /= division.amount
  }

  return dayjs(date).format('lll')
}

export function formatDate(date: number | string | Date) {
  const dateObj = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(dateObj)
}
