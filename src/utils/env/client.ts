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

export function getModerationUrl() {
  return checkEnv(
    process.env.NEXT_PUBLIC_MODERATION_URL,
    'NEXT_PUBLIC_MODERATION_URL',
    true
  )
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

export function getFirebaseConfig() { 
  const apiKey = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY')
  const authDomain = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
  const projectId = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  const storageBucket = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
  const messagingSenderId = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,'NEXT_PUBLIC_FIREBASE_MESSAGING_ID')
  const appId = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID,'NEXT_PUBLIC_FIREBASE_APP_ID')
  const measurementId = checkEnv(process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID')

  return { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId }
}

export function getFirebaseNotificationAppId() {
  return checkEnv(
    process.env.NEXT_PUBLIC_NOTIFICATION_APP_ID,
    'NEXT_PUBLIC_NOTIFICATION_APP_ID'
  )
}
