export const identityModerationEncoder = {
  encode: (id?: string) => id && `identity:${id}`,
  decode: (id?: string) => id && id.replace('identity:', ''),
  checker: (id?: string) => id && id.startsWith('identity:'),
}
