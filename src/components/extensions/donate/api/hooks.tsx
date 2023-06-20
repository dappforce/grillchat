import Toast from '@/components/Toast'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import {
  useAccount,
  useConnect,
  useContractReads,
  useContractWrite,
  useNetwork,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'
import { isTouchDevice } from '../../../../utils/device'
import { DonateModalStep } from '../DonateModal/types'
import { chainIdByChainName, polygonContractsByToken } from './config'
import { getConnector, openMobileWallet } from './utils'

export const useShowError = (
  isError: boolean,
  error: Error | null,
  message?: string
) => {
  useEffect(() => {
    if (isError) {
      toast.custom((t) => (
        <Toast t={t} title='Error' description={message || error?.message} />
      ))
    }
  }, [isError])
}

export const useConnectOrSwitchNetwork = (
  setCurrentStep: (currentStep: DonateModalStep) => void,
  chainName: string
) => {
  const { chains } = useNetwork()
  const { isConnected } = useAccount()

  const destChainId = chainIdByChainName[chainName]
  const connector = getConnector({ chains })

  const {
    switchNetwork,
    isLoading: isSwitchNetworkLoading,
    isError: isSwitchNetworkError,
    error: switchNetworkError,
  } = useSwitchNetwork()

  const {
    connect,
    data,
    isLoading: isConnectLoading,
    isError: isConnectWalletError,
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

  useShowError(isConnectWalletError, connectWalletError)
  useShowError(
    isSwitchNetworkError,
    switchNetworkError,
    `Make sure ${chainName} has been added to the wallet`
  )

  useEffect(() => {
    if (isSwitchNetworkLoading || (isConnectLoading && !isConnected)) {
      setCurrentStep('wallet-action-required')
    } else {
      setCurrentStep('donate-form')
    }
  }, [isSwitchNetworkLoading, isConnectLoading])

  const connectOrSwitch = () => {
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

      connect({ connector: connector.connector, chainId: destChainId })
    } else {
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
  const myGrillAddress = useMyAccount((state) => state.address)

  const { data: accountData } = getAccountDataQuery.useQuery(
    myGrillAddress || ''
  )

  const { evmAddress } = accountData || {}

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
        args: evmAddress ? [evmAddress] : [],
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
  }, [!!data, isLoading, token, evmAddress, myGrillAddress])

  return {
    balance: balance?.toString(),
    decimals: decimals ? parseInt(decimals.toString()) : undefined,
  }
}
