import TruncatedText from '@/components/TruncatedText'
import { useReferralSearchParam } from '@/components/referral/ReferralUrlChanger'
import { env } from '@/env.mjs'
import { getSpaceQuery } from '@/services/subsocial/spaces'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin, getHubPageLink } from '@/utils/links'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { HiQrCode } from 'react-icons/hi2'
import { RiDatabase2Line } from 'react-icons/ri'
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
  const { data: hub } = getSpaceQuery.useQuery(hubId)
  const [openedModalType, setOpenedModalType] = useState<
    'metadata' | 'qr' | null
  >(null)

  const refSearchParam = useReferralSearchParam()

  const content = hub?.content
  if (!content) return null

  const hubUrl = urlJoin(
    getCurrentUrlOrigin(),
    env.NEXT_PUBLIC_BASE_PATH,
    getHubPageLink(router),
    refSearchParam
  )
  const contentList: AboutModalProps['contentList'] = [
    {
      title: 'Description',
      content: content.about && <TruncatedText text={content.about} />,
    },
    {
      title: 'Hub link',
      content: hubUrl,
      redirectTo: hubUrl,
      textToCopy: hubUrl,
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
      iconClassName: cx('text-text-muted'),
      icon: RiDatabase2Line,
      onClick: () => setOpenedModalType('metadata'),
    },
  ]

  return (
    <>
      <AboutModal
        {...props}
        id={hub.id}
        isOpen={props.isOpen && openedModalType === null}
        entityTitle={content.name}
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
