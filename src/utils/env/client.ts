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

export function getAmpId() {
  return checkEnv(process.env.NEXT_PUBLIC_AMP_ID, 'NEXT_PUBLIC_AMP_ID')
}

export function getGaId() {
  return checkEnv(process.env.NEXT_PUBLIC_GA_ID, 'NEXT_PUBLIC_GA_ID')
}
