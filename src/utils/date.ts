import dayjs from 'dayjs'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(dayOfYear)

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

export function getDuration(time: number, unit: 'days' | 'hours' | 'minutes') {
  const duration = dayjs.duration(time)
  switch (unit) {
    case 'days':
      return duration.asDays()
    case 'hours':
      return duration.asHours()
    case 'minutes':
      return duration.asMinutes()
  }
}

export function getDurationWithPredefinedUnit(time: number): {
  duration: number
  unit: 'days' | 'hours' | 'minutes'
  text: string
} {
  if (time > 24 * 60 * 60 * 1000) {
    const duration = parseInt(getDuration(time, 'days').toString())
    return {
      duration,
      unit: 'days',
      text: `${duration} day${duration > 1 ? 's' : ''}`,
    }
  } else if (time > 60 * 60 * 1000) {
    const duration = parseInt(getDuration(time, 'hours').toString())
    return {
      duration,
      unit: 'hours',
      text: `${duration} hour${duration > 1 ? 's' : ''}`,
    }
  }
  const duration = parseInt(getDuration(time, 'minutes').toString())
  return {
    duration,
    unit: 'minutes',
    text: `${duration} min${duration > 1 ? 's' : ''}`,
  }
}

export function getDayOfYear(date?: Date) {
  return dayjs(date).dayOfYear()
}
