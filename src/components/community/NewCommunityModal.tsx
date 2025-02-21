import {
  CreateChatModalState,
  useCreateChatModal,
} from '@/stores/create-chat-modal'
import Modal from '../modals/Modal'

import { PostData } from '@subsocial/api/types'
import { useEffect, useState } from 'react'
import ChooseCommunityTypeContent from './content/ChooseCommunityType'
import LoadingContent from './content/LoadingContent'
import UpsertChatForm, { UpsertChatFormProps } from './content/UpsertChatForm'
import useRedirectToNewChatPage from './useRedirectToNewChatPage'

const chatContentByStep: {
  [key in CreateChatModalState]: (props: UpsertChatFormProps) => JSX.Element
} = {
  'new-comunity': ChooseCommunityTypeContent,
  'create-chat': UpsertChatForm,
  'update-chat': UpsertChatForm,
  loading: LoadingContent,
}

const getModalConfigByStep = (isWidget: boolean, isUpdateChat: boolean) => ({
  'new-comunity': {
    title: '💭 New Community',
  },
  'create-chat': {
    title: isWidget ? '💬 Your Community Chat' : '💬 New Group Chat',
  },
  'update-chat': {
    title: '✏️ Edit chat',
  },
  loading: {
    title: isUpdateChat ? 'Updating chat' : 'Creating chat',
  },
})

export type NewCommunityModalProps = {
  chat?: PostData
  hubId?: string
  spaceId?: string
  withBackButton?: boolean
  onBackClick?: () => void
  customOnClose?: () => void
  onSuccess?: () => void
}

const NewCommunityModal = ({
  hubId,
  spaceId,
  withBackButton,
  chat,
  customOnClose,
  onBackClick: customOnBackClick,
  onSuccess,
}: NewCommunityModalProps) => {
  const {
    openModal,
    isOpen,
    defaultOpenState,
    closeModal,
    onBackClick: storeOnBackClick,
  } = useCreateChatModal()
  const [isWidget, setIsWidget] = useState(false)

  // even after the tx succeed, datahub needs some time to process the data from squid, so there is some kind of delay before the post is ready to be fetched
  // if we don't use this hack, the user will be redirected to chat page with empty data
  // so we need to wait for the post to be ready and then redirect the user

  useEffect(() => {
    const isWidget = window.location.pathname.includes('/widget')

    setIsWidget(isWidget)
  }, [])

  useRedirectToNewChatPage(hubId, closeModal)

  const Content = chatContentByStep[defaultOpenState || 'new-comunity']

  const augmentedFormProps: UpsertChatFormProps = {
    ...(chat ? { chat } : {}),
    hubId,
    spaceId,
    onSuccess: chat ? onSuccess : undefined,
  }

  console.log(augmentedFormProps)

  const { title } = getModalConfigByStep(isWidget, !!chat)[
    defaultOpenState || 'new-comunity'
  ]

  const onBackClick =
    withBackButton && defaultOpenState !== 'new-comunity'
      ? () => openModal({ defaultOpenState: 'new-comunity' })
      : undefined

  const onBack = withBackButton
    ? customOnBackClick
      ? customOnBackClick
      : onBackClick
    : undefined

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      withCloseButton
      onBackClick={storeOnBackClick || onBack}
      closeModal={
        customOnClose
          ? () => {
              customOnClose()
              closeModal()
            }
          : closeModal
      }
    >
      <Content {...augmentedFormProps} />
    </Modal>
  )
}

export default NewCommunityModal
