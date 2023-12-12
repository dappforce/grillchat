import { getChatsForStakers } from '@/constants/chat'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { getIdFromSlug } from '@/utils/slug'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'

type LoginOption = 'polkadot' | 'all'

export default function useLoginOption() {
  const { query } = useRouter()
  const chatId =
    typeof query.slug === 'string' ? getIdFromSlug(query.slug) : undefined

  let loginOption: LoginOption = 'all'
  if (getChatsForStakers().includes(chatId ?? '')) {
    loginOption = 'polkadot'
  }

  const isOpen = useLoginModal((state) => state.isOpen)
  const waitingLoginResolvers = useRef<VoidFunction[]>([])
  const setIsOpen = useLoginModal((state) => state.setIsOpen)
  useEffect(() => {
    if (!isOpen) {
      waitingLoginResolvers.current.forEach((resolver) => resolver())
      waitingLoginResolvers.current = []
    }
  }, [isOpen])

  const promptUserForLogin = useCallback(async () => {
    setIsOpen(true)
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    waitingLoginResolvers.current.push(getResolver())
    await getPromise()
    return useMyAccount.getState().address
  }, [setIsOpen])

  return { loginOption, promptUserForLogin }
}
