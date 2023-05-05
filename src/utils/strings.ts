export function removeDoubleSpaces(str: string) {
  const multipleSpacesRegex = /\s\s+/g
  return str.replace(multipleSpacesRegex, ' ').trim()
}

export function isValidNumber(str: string) {
  return !isNaN(parseInt(str))
}
