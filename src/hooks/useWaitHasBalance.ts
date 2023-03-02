import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef, useState } from 'react'
import usePrevious from './usePrevious'
import useWaitNewBlock from './useWaitNewBlock'

export default function useWaitHasBalance() {
  const address = useMyAccount((state) => state.address)
  const balance = useMyAccount((state) => state.balance)
  const previousBalance = usePrevious(balance)

  const hasBalanceResolver = useRef<() => void | undefined>()
  const waitNewBlock = useWaitNewBlock()

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
    if (balance && balance > 0) {
      console.log('My Current Balance', balance)
      if (hasBalanceResolver.current) {
        const resolveHasBalance = () => {
          hasBalanceResolver.current?.()
          hasBalanceResolver.current = undefined
        }
        if (previousBalance === null) {
          resolveHasBalance()
        }
        waitNewBlock().then(resolveHasBalance)
      }
    } else {
      setHasBalancePromise(generatePromise())
    }
  }, [balance, generatePromise, waitNewBlock, previousBalance])

  return () => hasBalancePromise
}
