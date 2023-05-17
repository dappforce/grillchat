export function getCommonErrorMessage(
  e: any,
  fallbackMsg = 'Error has been occurred'
) {
  return e ? { message: fallbackMsg, ...e }.message : fallbackMsg
}
