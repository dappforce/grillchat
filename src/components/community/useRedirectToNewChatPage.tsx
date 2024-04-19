import { getPostQuery } from '@/services/api/query'
import { useCreateChatModal } from '@/stores/create-chat-modal'
import { useSubscriptionState } from '@/stores/subscription'
import { getChatPageLink, getWidgetChatPageLink } from '@/utils/links'
import { sendMessageToParentWindow } from '@/utils/window'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import urlJoin from 'url-join'

const useRedirectToNewChatPage = (hubId: string, onAction?: () => void) => {
  const { newChatId } = useCreateChatModal()
  const router = useRouter()
  const setSubscriptionState = useSubscriptionState(
    (state) => state.setSubscriptionState
  )

  const { data: newChat } = getPostQuery.useQuery(newChatId || '', {
    enabled: !!newChatId,
  })

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
      onAction?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newChat, hubId, router])
}

export default useRedirectToNewChatPage
