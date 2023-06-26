import useToastError from '@/hooks/useToastError'
import { useEffect, useMemo } from 'react'
import {
  useAccount,
  useConnect,
  useContractReads,
  useContractWrite,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'
import { isTouchDevice } from '../../../../utils/device'
import { DonateModalStep } from '../DonateModal/types'
import { chainIdByChainName, polygonContractsByToken } from './config'
import { getConnector, openMobileWallet } from './utils'

export const useConnectOrSwitchNetwork = (
  setCurrentStep: (currentStep: DonateModalStep) => void,
  chainName: string
) => {
  const { isConnected, connector: currentConnector } = useAccount()

  const destChainId = chainIdByChainName[chainName]
  const connector = getConnector()

  const {
    switchNetwork,
    isLoading: isSwitchNetworkLoading,
    error: switchNetworkError,
  } = useSwitchNetwork()

  const {
    connect,
    isLoading: isConnectLoading,
    error: connectWalletError,
  } = useConnect({
    onSuccess: async ({ chain }) => {
      const currentChainId = chain.id

      if (currentChainId !== destChainId) {
        isTouchDevice() && (await openMobileWallet({ connector }))
        switchNetwork?.(destChainId)
      }
    },
  })

  useToastError<Error | null>(
    connectWalletError,
    'Connecting wallet error',
    (e) => e?.message || ''
  )

  useToastError<Error | null>(
    switchNetworkError,
    'Switch network failed',
    () => {
      setCurrentStep('add-network')
      return `Make sure ${chainName} has been added to the wallet`
    }
  )

  useEffect(() => {
    if (!switchNetworkError) {
      if (isSwitchNetworkLoading || (isConnectLoading && !isConnected)) {
        setCurrentStep('wallet-action-required')
      } else {
        setCurrentStep('donate-form')
      }
    }
  }, [isSwitchNetworkLoading, isConnectLoading, switchNetworkError])

  const connectOrSwitch = async () => {
    if (!isConnected) {
      isTouchDevice() &&
        connector.connector.on(
          'message',
          async ({ type }: { type: string }) => {
            return type === 'connecting'
              ? (async () => {
                  await openMobileWallet({ connector })
                })()
              : undefined
          }
        )
      connect({ connector: currentConnector || connector.connector })
    } else {
      isTouchDevice() && (await openMobileWallet({ connector }))
      switchNetwork?.(destChainId)
    }
  }

  return {
    connectOrSwitch,
  }
}

export const useDonate = (token: string, chainName: string) => {
  const { sendTransactionAsync } = useSendTransaction()

  const { abi, address } = polygonContractsByToken[token]
  const chainId = chainIdByChainName[chainName]

  const { writeAsync } = useContractWrite({
    address,
    abi,
    functionName: 'transfer',
    chainId,
  } as any)

  const sendTransferTx = async (
    recipient: string,
    amount: bigint,
    setCurrentStep: (currentStep: DonateModalStep) => void,
    isNativeToken?: boolean,
    decimals?: number
  ) => {
    setCurrentStep('wallet-action-required')

    const connector = getConnector()
    isTouchDevice() && (await openMobileWallet({ connector }))

    try {
      if (!decimals) return
      const { hash } = isNativeToken
        ? await sendTransactionAsync({
            to: recipient,
            value: amount,
            chainId,
          })
        : await writeAsync({
            args: [recipient, amount],
          })
      return hash
    } catch (e) {
      console.error('Transfer error: ', e)
      setCurrentStep('donate-form')
      return
    }
  }

  return { sendTransferTx }
}

export const useGetBalance = (token: string, chainName: string) => {
  const { address: currentEvmAddress } = useAccount()

  const { address, abi } = polygonContractsByToken[token]
  const chainId = chainIdByChainName[chainName]

  const commonParams = {
    address,
    abi,
    chainId,
  }

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...commonParams,
        functionName: 'balanceOf',
        args: currentEvmAddress ? [currentEvmAddress] : [],
      },
      {
        ...commonParams,
        functionName: 'decimals',
      },
    ],
    watch: true,
  })

  const { balance, decimals } = useMemo(() => {
    if (!data) return {}

    const [balance, decimals] = data.map((item) => item.result)

    return { balance: balance, decimals }
  }, [!!data, isLoading, token, currentEvmAddress])

  return {
    balance: balance?.toString(),
    decimals: decimals ? parseInt(decimals.toString()) : undefined,
  }
}
