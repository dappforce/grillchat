import { getSpaceBySpaceIdQuery } from '@/services/subsocial/spaces'
import { getCurrentUrlOrigin, getHomePageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiCircleStack, HiQrCode } from 'react-icons/hi2'
import urlJoin from 'url-join'
import MetadataModal from '../MetadataModal'
import { ModalFunctionalityProps } from '../Modal'
import QrCodeModal from '../QrCodeModal'
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
    'metadata' | 'qr' | null
  >(null)

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
      text: 'Show QR code',
      iconClassName: 'text-text-muted',
      icon: HiQrCode,
      onClick: () => setOpenedModalType('qr'),
    },
    {
      text: 'Show Metadata',
      iconClassName: 'text-text-muted',
      icon: HiCircleStack,
      onClick: () => setOpenedModalType('metadata'),
    },
  ]

  return (
    <>
      <AboutModal
        {...props}
        isOpen={props.isOpen && openedModalType === null}
        title={content.name}
        isImageCircle={false}
        subtitle={`${chatCount} chats in hub`}
        image={content.image}
        contentList={contentList}
        actionMenu={actionMenu}
      />
      <MetadataModal
        onBackClick={() => setOpenedModalType(null)}
        closeModal={() => setOpenedModalType(null)}
        isOpen={openedModalType === 'metadata'}
        entity={hub}
        postIdTextPrefix='Hub'
      />
      <QrCodeModal
        isOpen={openedModalType === 'qr'}
        closeModal={() => setOpenedModalType(null)}
        title='Hub QR Code'
        description='You can use this QR code to quickly share the hub with anyone.'
        withCloseButton
        onBackClick={() => setOpenedModalType(null)}
        url={hubUrl}
        urlTitle={content.name}
      />
    </>
  )
}
