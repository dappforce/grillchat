import { env } from '@/env.mjs'

export function getReferralLink(ref: string | null) {
  return `https://t.me/${env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}?start=${
    ref ?? ''
  }`
}
