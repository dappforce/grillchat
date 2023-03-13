import { checkEnv } from './common'

export function getCaptchaSiteKey() {
  return checkEnv(
    process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
    'NEXT_PUBLIC_CAPTCHA_SITE_KEY',
    true
  )
}

export function getSpaceId() {
  return checkEnv(
    process.env.NEXT_PUBLIC_SPACE_ID,
    'NEXT_PUBLIC_SPACE_ID',
    true
  )
}

export function getBaseUrl() {
  return checkEnv(
    process.env.NEXT_PUBLIC_BASE_URL,
    'NEXT_PUBLIC_BASE_URL',
    true
  )
}
