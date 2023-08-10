export function checkEnv(
  data: string | undefined,
  envName: string,
  throwError = false
) {
  if (data === undefined && throwError) {
    throw new Error(`env ${envName} is not set`)
  }
  return data ?? ''
}
