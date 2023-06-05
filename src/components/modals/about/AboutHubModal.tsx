import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getCurrentUrlOrigin, getHubPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack } from 'react-icons/hi2'
import urlJoin from 'url-join'
import MetadataModal from '../MetadataModal'
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
  const [isOpenMetadataModal, setIsOpenMetadataModal] = useState(false)

  const content = hub?.content
  if (!content) return null

  const hubUrl = urlJoin(getCurrentUrlOrigin(), getHubPageLink(router))
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

  const actionMenu: AboutModalProps['actionMenu'] = [
    {
      text: 'Show Metadata',
      icon: HiCircleStack,
      onClick: () => setIsOpenMetadataModal(true),
    },
  ]

  return (
    <>
      <AboutModal
        {...props}
        title={content.name}
        isImageCircle={false}
        subtitle={`${chatCount} chats in hub`}
        image={content.image}
        contentList={contentList}
        actionMenu={actionMenu}
      />
      <MetadataModal
        closeModal={() => setIsOpenMetadataModal(false)}
        isOpen={isOpenMetadataModal}
        entity={hub}
        postIdTextPrefix='Hub'
      />
    </>
  )
}
