import { checkEnv } from './common'

export function getCaptchaSiteKey() {
  return checkEnv(
    process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY,
    'NEXT_PUBLIC_CAPTCHA_SITE_KEY',
    true
  )
}

export function getMainHubId() {
  const hubIds = checkEnv(
    process.env.NEXT_PUBLIC_SPACE_IDS,
    'NEXT_PUBLIC_SPACE_IDS',
    true
  )
  return hubIds.split(',')[0]
}

export function getHubIds() {
  const hubIds = checkEnv(
    process.env.NEXT_PUBLIC_SPACE_IDS,
    'NEXT_PUBLIC_SPACE_IDS',
    true
  )
  return hubIds.split(',')
}

export function getAmpId() {
  return checkEnv(process.env.NEXT_PUBLIC_AMP_ID, 'NEXT_PUBLIC_AMP_ID')
}

export function getGaId() {
  return checkEnv(process.env.NEXT_PUBLIC_GA_ID, 'NEXT_PUBLIC_GA_ID')
}

export function getSquidUrl() {
  return checkEnv(process.env.NEXT_PUBLIC_SQUID_URL, 'NEXT_PUBLIC_SQUID_URL')
}
