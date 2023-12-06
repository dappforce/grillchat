import { checkEnv } from './common'

export function getAppId() {
  return checkEnv(process.env.NEXT_PUBLIC_APP_ID, 'NEXT_PUBLIC_APP_ID')
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

export function getFirebaseConfig() {
  const apiKey = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    'NEXT_PUBLIC_FIREBASE_API_KEY'
  )
  const authDomain = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'
  )
  const projectId = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
  )
  const storageBucket = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'
  )
  const messagingSenderId = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
    'NEXT_PUBLIC_FIREBASE_MESSAGING_ID'
  )
  const appId = checkEnv(
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  )

  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId
  ) {
    return null
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  }
}

export function getFirebaseNotificationAppId() {
  return checkEnv(
    process.env.NEXT_PUBLIC_NOTIFICATION_APP_ID,
    'NEXT_PUBLIC_NOTIFICATION_APP_ID'
  )
}

export function getCommunityHubId() {
  return checkEnv(
    process.env.NEXT_PUBLIC_COMMUNITY_HUB_ID,
    'NEXT_PUBLIC_COMMUNITY_HUB_ID'
  )
}

export function getDatahubConfig() {
  const queryUrl = checkEnv(
    process.env.NEXT_PUBLIC_DATAHUB_QUERY_URL,
    'NEXT_PUBLIC_DATAHUB_QUERY_URL'
  )
  const subscriptionUrl = checkEnv(
    process.env.NEXT_PUBLIC_DATAHUB_SUBSCRIPTION_URL,
    'NEXT_PUBLIC_DATAHUB_SUBSCRIPTION_URL'
  )
  if (!queryUrl || !subscriptionUrl) return null

  return { queryUrl, subscriptionUrl }
}

export function getOffchainPostingHubs() {
  const offchainOffchainHubs = checkEnv(
    process.env.NEXT_PUBLIC_OFFCHAIN_POSTING_HUBS,
    'NEXT_PUBLIC_OFFCHAIN_POSTING_HUBS'
  )
  return offchainOffchainHubs.split(',')
}
