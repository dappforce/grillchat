import { useMyAccount } from '@/stores/my-account'
import { useCallback, useEffect, useRef, useState } from 'react'
import usePrevious from './usePrevious'

export default function useWaitHasEnergy() {
  const address = useMyAccount((state) => state.address)
  const energy = useMyAccount((state) => state.energy)
  const previousEnergy = usePrevious(energy)

  const hasEnergyResolver = useRef<() => void | undefined>()

  const generatePromise = useCallback(
    () =>
      new Promise<void>((resolve) => {
        hasEnergyResolver.current = () => resolve()
      }),
    []
  )
  const [hasEnergyPromise, setHasEnergyPromise] =
    useState<Promise<void>>(generatePromise)

  useEffect(() => {
    setHasEnergyPromise(generatePromise())
  }, [address, generatePromise])

  useEffect(() => {
    if (energy && energy > 0) {
      if (hasEnergyResolver.current) {
        const resolveHasEnergy = () => {
          hasEnergyResolver.current?.()
          hasEnergyResolver.current = undefined
        }
        resolveHasEnergy()
      }
    } else {
      setHasEnergyPromise(generatePromise())
    }
  }, [energy, generatePromise, previousEnergy])

  return () => hasEnergyPromise
}
