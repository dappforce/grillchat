import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef } from 'react'

export default function useWaitHasEnergy(timeout = 5_000) {
  const address = useMyAccount((state) => state.address)
  const energy = useMyAccount((state) => state.energy)
  const resubscribeEnergy = useMyAccount((state) => state._subscribeEnergy)

  const hasEnergyResolvers = useRef<(() => void)[]>([])

  const generateNewPromise = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new Error(
            "You don't have enough energy to perform this action. Please try again"
          )
        )
        resubscribeEnergy()
      }, timeout)
      hasEnergyResolvers.current.push(() => {
        clearTimeout(timeoutId)
        resolve()
      })
    })
  }, [timeout, resubscribeEnergy])

  useEffect(() => {
    if (!energy || energy <= 0) return
    hasEnergyResolvers.current.forEach((resolve) => resolve())
    hasEnergyResolvers.current = []
  }, [energy, generateNewPromise])

  useEffect(() => {
    return () => {
      hasEnergyResolvers.current.forEach((resolve) => resolve())
      hasEnergyResolvers.current = []
    }
  }, [address])

  return () => {
    return !energy ? generateNewPromise() : Promise.resolve()
  }
}
