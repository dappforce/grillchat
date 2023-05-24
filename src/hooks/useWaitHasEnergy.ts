import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useWaitHasEnergy() {
  const address = useMyAccount((state) => state.address)
  const energy = useMyAccount((state) => state.energy)

  const hasEnergyResolvers = useRef<(() => void)[]>([])

  const generateNewPromise = useCallback(
    () =>
      new Promise<void>((resolve) => {
        hasEnergyResolvers.current.push(() => resolve())
      }),
    []
  )
  // save current and previous account's promises, so there are no dangling promises
  const [hasEnergyPromises, setHasEnergyPromises] = useState<Promise<void>[]>(
    () => [generateNewPromise()]
  )

  useEffect(() => {
    setHasEnergyPromises((prev) => [...prev, generateNewPromise()])
  }, [address, generateNewPromise])

  useEffect(() => {
    if (!energy || energy <= 0) return
    console.log('Energy updated', energy)
    hasEnergyResolvers.current.forEach((resolve) => resolve())
    hasEnergyResolvers.current = []
  }, [energy, generateNewPromise])

  return () => hasEnergyPromises[hasEnergyPromises.length - 1]
}
