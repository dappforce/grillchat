import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef } from 'react'

export default function useWaitHasEnergy(timeout = 5_000) {
  const address = useMyAccount((state) => state.address)
  const energy = useMyAccount((state) => state.energy)

  const hasEnergyResolvers = useRef<(() => void)[]>([])

  const generateNewPromise = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(
          new Error(
            "Energy timeout: You don't have enough energy to perform this action."
          )
        )
      }, timeout)
      hasEnergyResolvers.current.push(() => {
        clearTimeout(timeoutId)
        resolve()
      })
    })
  }, [timeout])

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
