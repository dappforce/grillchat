import { env } from '@/env.mjs'
import dayjs from 'dayjs'

export function getIsContestEnded() {
  const isContestEnded = dayjs().isAfter(
    dayjs(env.NEXT_PUBLIC_CONTEST_END_TIME)
  )
  return isContestEnded
}

export function getIsInContest(chatId: string) {
  return chatId === env.NEXT_PUBLIC_CONTEST_CHAT_ID
}
