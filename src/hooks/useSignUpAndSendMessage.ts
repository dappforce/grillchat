import { useSignUp } from '@/services/api/mutations'
import { useSendMessage } from '@/services/subsocial/mutations'
import { useMyAccount } from '@/stores/my-account'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

export function useSignUpAndSendMessage() {
  const { mutateAsync: signUp } = useSignUp()
  const { mutateAsync: sendMessage } = useSendMessage()
  const login = useMyAccount((state) => state.login)

  const hasBalanceResolver = useRef<() => void>(() => undefined)
  const [hasBalancePromise] = useState<Promise<void>>(
    () =>
      new Promise<void>((resolve) => {
        hasBalanceResolver.current = () => resolve()
      })
  )
  const balance = useMyAccount((state) => state.balance)

  useEffect(() => {
    if (balance > 0) {
      hasBalanceResolver.current?.()
    }
  }, [balance])

  const signUpAndSendMessage = async (
    params: Parameters<typeof signUp>[0] &
      Parameters<typeof sendMessage>[0] & { secretKey: string }
  ) => {
    const { address, captchaToken, secretKey, ...sendMessageParams } = params
    const successLogin = await login(secretKey)
    if (!successLogin) throw new Error('Failed to login')

    await signUp({ address, captchaToken })
    await hasBalancePromise
    console.log('sending msg...', sendMessageParams)
    // await sendMessage(sendMessageParams)
  }

  return useMutation(signUpAndSendMessage)
}
