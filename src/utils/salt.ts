const ANALYTICS_SALT_KEY = 'analytics_salt_key'

export const getSalt = () => {
  let salt = localStorage.getItem(ANALYTICS_SALT_KEY)
  if (!salt) {
    salt = Buffer.from(crypto.getRandomValues(new Int8Array(8))).toString('hex')
    localStorage.setItem(ANALYTICS_SALT_KEY, salt)
  }
  return salt
}
