import LinkText from '@/components/LinkText'
import { getSpaceQuery } from '@/services/subsocial/spaces'

type SpaceLinkProps = {
  spaceId?: string
}

export const SpaceLink = ({ spaceId }: SpaceLinkProps) => {
  if (!spaceId) return null

  const { data: space } = getSpaceQuery.useQuery(spaceId)

  const handle = space?.struct.handle

  const spaceName = space?.content?.name

  const origin =
    typeof window !== 'undefined' ? window.location.origin : undefined

  const href = origin + (handle ? `@${handle}` : `/${spaceId}`)

  return (
    <LinkText href={href} target='_blank'>
      {spaceName}
    </LinkText>
  )
}
