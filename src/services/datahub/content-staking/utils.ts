import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(isoWeek)

export function getDayAndWeekTimestamp(currentDate: Date = new Date()) {
  let date = dayjs.utc(currentDate)
  date = date.startOf('day')
  const week = date.get('year') * 100 + date.isoWeek()
  return { day: date.unix(), week }
}
