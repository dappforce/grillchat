import Button from '@/components/Button'
import ChatImage from '@/components/chats/ChatImage'
import DataCard from '@/components/DataCard'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import { useIntegratedSkeleton } from '@/components/SkeletonFallback'
import { env } from '@/env.mjs'
import { getPostQuery } from '@/services/api/query'
import { getChatPageLink, getCurrentUrlOrigin } from '@/utils/links'
import { createSlug } from '@/utils/slug'
import { openNewWindow, twitterShareUrl } from '@/utils/social-share'
import urlJoin from 'url-join'

export type ChatCreateSuccessModalProps = ModalFunctionalityProps & {
  chatId: string
  hubId: string
}
export default function ChatCreateSuccessModal({
  chatId,
  hubId,
  ...props
}: ChatCreateSuccessModalProps) {
  const { data, isLoading } = getPostQuery.useQuery(chatId)
  const { IntegratedSkeleton } = useIntegratedSkeleton(isLoading)

  const chatLink = urlJoin(
    getCurrentUrlOrigin(),
    env.NEXT_PUBLIC_BASE_PATH,
    getChatPageLink({ query: {} }, createSlug(chatId, data?.content), hubId)
  )

  return (
    <Modal {...props} title='🎉 Chat Created' withCloseButton>
      <div className='flex flex-col items-center gap-6'>
        <ChatImage
          chatId={chatId}
          className='h-20 w-20 md:h-24 md:w-24'
          image={data?.content?.image}
          chatTitle={data?.content?.title}
        />
        <IntegratedSkeleton content={data?.content?.title} className='text-xl'>
          {(title) => <p className='text-center text-xl'>{title}</p>}
        </IntegratedSkeleton>
        <DataCard
          data={[
            {
              title: 'Chat link',
              content: chatLink,
              openInNewTab: true,
              redirectTo: chatLink,
              textToCopy: chatLink,
            },
          ]}
        />

        <div className='flex w-full flex-col gap-4'>
          <Button
            className='self-stretch'
            size='lg'
            onClick={() =>
              openNewWindow(
                twitterShareUrl(
                  chatLink,
                  'I just created a new discussion room on Grill.chat, come check it out!'
                )
              )
            }
          >
            Post about it on X!
          </Button>
        </div>
      </div>
    </Modal>
  )
}
