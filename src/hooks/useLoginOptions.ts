import { useLoginModal } from '@/stores/login-modal'
import { useMyAccount } from '@/stores/my-account'
import { generateManuallyTriggeredPromise } from '@/utils/promise'
import { useCallback, useEffect, useRef } from 'react'

export default function useLoginOptions() {
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

  return { promptUserForLogin }
}
