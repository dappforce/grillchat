import {
  CreateChatModalState,
  useCreateChatModal,
} from '@/stores/create-chat-modal'
import Modal from '../modals/Modal'

import { PostData } from '@subsocial/api/types'
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
    title: 'Loading...',
  },
}

export type NewCommunityModalProps = {
  chat?: PostData
  hubId?: string
  withBackButton?: boolean
}

const NewCommunityModal = ({
  hubId,
  withBackButton = true,
  chat,
}: NewCommunityModalProps) => {
  const { openModal, isOpen, defaultOpenState, closeModal } =
    useCreateChatModal()

  const Content = chatContentByStep[defaultOpenState || 'new-comunity']

  const { title } = modalConfigByStep[defaultOpenState || 'new-comunity']

  const augmentedFormProps: UpsertChatFormProps = {
    hubId,
    ...(chat ? chat : {}),
  }

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      withCloseButton
      onBackClick={
        withBackButton && defaultOpenState !== 'new-comunity'
          ? () => openModal({ defaultOpenState: 'new-comunity' })
          : undefined
      }
      closeModal={closeModal}
    >
      <Content {...augmentedFormProps} />
    </Modal>
  )
}

export default NewCommunityModal
