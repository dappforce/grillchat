import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useWaitHasBalance() {
  const address = useMyAccount((state) => state.address)
  const balance = useMyAccount((state) => state.balance)
  const hasBalanceResolver = useRef<() => void>(() => undefined)

  const generatePromise = useCallback(
    () =>
      new Promise<void>((resolve) => {
        hasBalanceResolver.current = () => resolve()
      }),
    []
  )
  const [hasBalancePromise, setHasBalancePromise] =
    useState<Promise<void>>(generatePromise)

  useEffect(() => {
    setHasBalancePromise(generatePromise())
  }, [address, generatePromise])

  useEffect(() => {
    if (balance > 0) {
      console.log('MY CURRENT BALANCE: ', balance)
      hasBalanceResolver.current?.()
    } else {
      setHasBalancePromise(generatePromise())
    }
  }, [balance, generatePromise])

  return () => hasBalancePromise
}
