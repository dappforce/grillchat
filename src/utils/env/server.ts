import { checkEnv } from './common'

export function getServerMnemonic() {
  return checkEnv(process.env.SERVER_MNEMONIC, 'SERVER_MNEMONIC', true)
}

export function getDiscussionCreatorMnemonic() {
  return checkEnv(
    process.env.SERVER_DISCUSSION_CREATOR_MNEMONIC,
    'SERVER_DISCUSSION_CREATOR_MNEMONIC',
    true
  )
}

export function getCaptchaSecret() {
  return checkEnv(process.env.CAPTCHA_SECRET, 'CAPTCHA_SECRET', true)
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

export function getCovalentApiKey() {
  return checkEnv(process.env.COVALENT_API_KEY, 'COVALENT_API_KEY')
}
