import { useMyAccount } from '@/stores/my-account'
import { getNetwork } from '@/utils/network'
import { useCallback, useEffect, useRef } from 'react'
import useWaitNewBlock from './useWaitNewBlock'
import useWrapInRef from './useWrapInRef'

const DEFAULT_TIMEOUT = getNetwork() === 'xsocial' ? 10_000 : 20_000
export default function useWaitHasEnergy(
  isUsingConnectedWallet?: boolean,
  timeout = DEFAULT_TIMEOUT
) {
  const hasEnergyResolvers = useRef<(() => void)[]>([])
  const { address, energy, resubscribeEnergy } = useAccountSwitch(
    isUsingConnectedWallet
  )
  const waitNewBlock = useWaitNewBlock()
  const energyRef = useWrapInRef(energy)

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
    if (!energy || energy <= 0 || hasEnergyResolvers.current.length === 0)
      return
    function resolveAllPending() {
      hasEnergyResolvers.current.forEach((resolve) => resolve())
      hasEnergyResolvers.current = []
    }
    if (getNetwork() === 'xsocial') {
      resolveAllPending()
    } else {
      waitNewBlock().then(resolveAllPending)
    }
  }, [energy, generateNewPromise, waitNewBlock])

  useEffect(() => {
    return () => {
      hasEnergyResolvers.current.forEach((resolve) => resolve())
      hasEnergyResolvers.current = []
    }
  }, [address])

  return () => {
    // need to use ref because if not it can have stale energy value
    return !energyRef.current ? generateNewPromise() : Promise.resolve()
  }
}

function useAccountSwitch(isUsingConnectedWallet = false) {
  const address = useMyAccount((state) => state.address)
  const energy = useMyAccount((state) => state.energy)
  const resubscribeEnergy = useMyAccount((state) => state._subscribeEnergy)

  const connectedWallet = useMyAccount((state) => state.connectedWallet)
  const resubscribeConnectedWalletEnergy = useMyAccount(
    (state) => state._subscribeConnectedWalletEnergy
  )

  const usedData = { address, energy, resubscribeEnergy }
  if (isUsingConnectedWallet) {
    usedData.address = connectedWallet?.address ?? null
    usedData.energy = connectedWallet?.energy ?? 0
    usedData.resubscribeEnergy = resubscribeConnectedWalletEnergy
  }

  return usedData
}
