function getSpaceIdFromUrl(asPath: string) {
  return asPath.split('/')[1]
}

export function getHomePageLink(asPath: string) {
  const spaceId = getSpaceIdFromUrl(asPath)
  return `/${spaceId ?? ''}`
}

export function getChatPageLink(asPath: string, chatSlug: string) {
  const spaceId = getSpaceIdFromUrl(asPath)
  return `/${spaceId}/c/${chatSlug}`
}
