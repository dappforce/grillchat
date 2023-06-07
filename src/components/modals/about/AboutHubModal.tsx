import QrCode from '@/components/QrCode'
import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getCurrentUrlOrigin, getHomePageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack, HiQrCode } from 'react-icons/hi2'
import urlJoin from 'url-join'
import MetadataModal from '../MetadataModal'
import Modal, { ModalFunctionalityProps } from '../Modal'
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

  const [openedModalType, setOpenedModalType] = useState<
    '' | 'metadata' | 'qr'
  >('')

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

  const actionMenu: AboutModalProps['actionMenu'] = [
    {
      text: 'Show QR',
      icon: HiQrCode,
      onClick: () => setOpenedModalType('qr'),
    },
    {
      text: 'Show Metadata',
      icon: HiCircleStack,
      onClick: () => setOpenedModalType('metadata'),
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
        closeModal={() => setOpenedModalType('')}
        isOpen={openedModalType === 'metadata'}
        entity={hub}
        postIdTextPrefix='Hub'
      />
      <Modal
        isOpen={openedModalType === 'qr'}
        closeModal={() => setOpenedModalType('')}
      >
        <QrCode url={hubUrl} />
      </Modal>
    </>
  )
}
