import { getChatIdsWithoutAnonLoginOptions } from '@/constants/chat'
import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { getIdFromSlug } from '@/utils/slug'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef } from 'react'

export default function useWithoutAnonLoginOptions() {
  const { query } = useRouter()
  const chatId =
    typeof query.slug === 'string' ? getIdFromSlug(query.slug) : undefined
  const withoutAnonLoginOptions = getChatIdsWithoutAnonLoginOptions().includes(
    chatId ?? ''
  )

  const isOpen = useLoginModal((state) => state.isOpen)
  const waitingLoginResolvers = useRef<VoidFunction[]>([])
  useEffect(() => {
    if (!isOpen) {
      waitingLoginResolvers.current.forEach((resolver) => resolver())
      waitingLoginResolvers.current = []
    }
  }, [isOpen])

  const setIsOpen = useLoginModal((state) => state.setIsOpen)

  const promptUserForLogin = useCallback(async () => {
    setIsOpen(true)
    const { getPromise, getResolver } = generateManuallyTriggeredPromise()
    waitingLoginResolvers.current.push(getResolver())
    await getPromise()
    return useMyAccount.getState().address
  }, [setIsOpen])

  return { withoutAnonLoginOptions, promptUserForLogin }
}
