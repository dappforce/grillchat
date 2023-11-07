import { checkEnv } from './common'

export function getServerMnemonic() {
  return checkEnv(process.env.SERVER_MNEMONIC, 'SERVER_MNEMONIC', true)
}

export function getDiscussionCreatorMnemonic() {
  return checkEnv(
    process.env.SERVER_DISCUSSION_CREATOR_MNEMONIC,
    'SERVER_DISCUSSION_CREATOR_MNEMONIC'
  )
}

export function getCaptchaSecret() {
  return checkEnv(process.env.CAPTCHA_SECRET, 'CAPTCHA_SECRET')
}

export function getCrustIpfsAuth() {
  return checkEnv(process.env.CRUST_IPFS_AUTH, 'CRUST_IPFS_AUTH', true)
}

export function getUserIdSalt() {
  return checkEnv(process.env.USER_ID_SALT, 'USER_ID_SALT', false)
}

export function getIpfsPinUrl() {
  return (
    checkEnv(process.env.IPFS_PIN_URL, 'IPFS_PIN_URL') ||
    'https://pin.crustcloud.io/psa'
  )
}

export function getIpfsWriteUrl() {
  return (
    checkEnv(process.env.IPFS_WRITE_URL, 'IPFS_WRITE_URL') ||
    'https://gw-seattle.crustcloud.io'
  )
}

export function getCovalentApiKey() {
  return checkEnv(process.env.COVALENT_API_KEY, 'COVALENT_API_KEY')
}

export function getNotificationsConfig() {
  const url = checkEnv(process.env.NOTIFICATIONS_URL, 'NOTIFICATIONS_URL')
  const token = checkEnv(process.env.NOTIFICATIONS_TOKEN, 'NOTIFICATIONS_TOKEN')
  return { url, token }
}

export function getRedisConfig() {
  const host = checkEnv(process.env.REDIS_HOST, 'REDIS_HOST')
  const port = checkEnv(process.env.REDIS_PORT, 'REDIS_PORT')
  const password = checkEnv(process.env.REDIS_PASSWORD, 'REDIS_PASSWORD')

  const parsedPort = parseInt(port)

  if (!host || !port || isNaN(parsedPort) || !password) {
    throw new Error(
      'Redis configuration is not complete, need host, port, password'
    )
  }

  return { host, port: parsedPort, password }
}

export function getSubsocialPromoSecret() {
  return checkEnv(
    process.env.SUBSOCIAL_PROMO_SECRET_HEX,
    'SUBSOCIAL_PROMO_SECRET_HEX'
  )
}

export function getModerationConfig() {
  const url = checkEnv(process.env.MODERATION_URL, 'MODERATION_URL')
  const token = checkEnv(process.env.MODERATION_TOKEN, 'MODERATION_TOKEN')
  return { url, token }
}

export function getDatahubMutationConfig() {
  const queueUrl = checkEnv(process.env.DATAHUB_QUEUE_URL, 'DATAHUB_QUEUE_URL')
  const queueToken = checkEnv(
    process.env.DATAHUB_QUEUE_TOKEN,
    'DATAHUB_QUEUE_TOKEN'
  )

  return { url: queueUrl, token: queueToken }
}
