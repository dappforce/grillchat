import {
  CreateChatModalState,
  useCreateChatModal,
} from '@/stores/create-chat-modal'
import Modal from '../modals/Modal'

import { getPostQuery } from '@/services/api/query'
import { useSubscriptionState } from '@/stores/subscription'
import { getChatPageLink, getWidgetChatPageLink } from '@/utils/links'
import { sendMessageToParentWindow } from '@/utils/window'
import { PostData } from '@subsocial/api/types'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import urlJoin from 'url-join'
import ChooseCommunityTypeContent from './content/ChooseCommunityType'
import LoadingContent from './content/LoadingContent'
import UpsertChatForm, { UpsertChatFormProps } from './content/UpsertChatForm'

const chatContentByStep: {
  [key in CreateChatModalState]: (props: UpsertChatFormProps) => JSX.Element
} = {
  'new-comunity': ChooseCommunityTypeContent,
  'create-chat': UpsertChatForm,
  'update-chat': UpsertChatForm,
  loading: LoadingContent,
}

const modalConfigByStep = {
  'new-comunity': {
    title: '💭 New Community',
  },
  'create-chat': {
    title: '💬 New Group Chat',
  },
  'update-chat': {
    title: '✏️ Edit chat',
  },
  loading: {
    title: 'Creating chat',
  },
}

export type NewCommunityModalProps = {
  chat?: PostData
  hubId?: string
  withBackButton?: boolean
  onBackClick?: () => void
  customOnClose?: () => void
}

const NewCommunityModal = ({
  hubId,
  withBackButton = true,
  chat,
  customOnClose,
  onBackClick: customOnBackClick,
}: NewCommunityModalProps) => {
  const { openModal, isOpen, defaultOpenState, newChatId, closeModal } =
    useCreateChatModal()
  const router = useRouter()

  // even after the tx succeed, datahub needs some time to process the data from squid, so there is some kind of delay before the post is ready to be fetched
  // if we don't use this hack, the user will be redirected to chat page with empty data
  // so we need to wait for the post to be ready and then redirect the user
  const { data: newChat } = getPostQuery.useQuery(newChatId || '', {
    enabled: !!newChatId,
  })

  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )

  useEffect(() => {
    if (newChat) {
      const chatId = newChat.id
      async function onSuccessChatCreation() {
        const isWidget = window.location.pathname.includes('/widget')

        if (isWidget) {
          sendMessageToParentWindow(
            'redirect-hard',
            `${getWidgetChatPageLink({ query: {} }, chatId, hubId)}/?new=true`
          )
        } else {
          await router.push(
            urlJoin(getChatPageLink({ query: {} }, chatId, hubId), '?new=true')
          )
        }
      }
      onSuccessChatCreation()
      setSubscriptionState('post', 'dynamic')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChat, hubId, router])

  const Content = chatContentByStep[defaultOpenState || 'new-comunity']

  const { title } = modalConfigByStep[defaultOpenState || 'new-comunity']

  const augmentedFormProps: UpsertChatFormProps = {
    hubId,
    ...(chat ? chat : {}),
  }

  const onBackClick =
    withBackButton && defaultOpenState !== 'new-comunity'
      ? () => openModal({ defaultOpenState: 'new-comunity' })
      : undefined

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      withCloseButton
      onBackClick={customOnBackClick ? customOnBackClick : onBackClick}
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
