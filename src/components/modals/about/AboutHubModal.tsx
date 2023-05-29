import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getCurrentUrlOrigin, getHomePageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import urlJoin from 'url-join'
import { ModalFunctionalityProps } from '../Modal'
import AboutModal, { AboutModalProps } from './AboutModal'

export type AboutHubModalProps = ModalFunctionalityProps & {
  hubId: string
  chatCount?: number
}

export default function AboutHubModal({
  hubId,
  chatCount,
  ...props
}: AboutHubModalProps) {
  const router = useRouter()
  const { data: hub } = getSpaceBySpaceIdQuery.useQuery(hubId)

  const content = hub?.content
  if (!content) return null

  const hubUrl = urlJoin(getCurrentUrlOrigin(), getHomePageLink(router))
  const contentList: AboutModalProps['contentList'] = [
    { title: 'Description', content: content.about },
    {
      title: 'Hub link',
      content: hubUrl,
      redirectTo: hubUrl,
      withCopyButton: true,
      openInNewTab: true,
    },
  ]

  return (
    <AboutModal
      {...props}
      title={content.name}
      isImageCircle={false}
      subtitle={`${chatCount} chats in hub`}
      imageCid={content.image}
      contentList={contentList}
    />
  )
}
