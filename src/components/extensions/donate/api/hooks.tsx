import useToastError from '@/hooks/useToastError'
import { useEffect, useMemo } from 'react'
import {
  useAccount,
  useBalance,
  useConnect,
  useContractReads,
  useContractWrite,
  useSendTransaction,
  useSwitchNetwork,
} from 'wagmi'
import { isTouchDevice } from '../../../../utils/device'
import { DonateModalStep } from '../DonateModal/types'
import { tokensItems } from '../DonateModal/utils'
import { chainIdByChainName, contractsByChainName } from './config'
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
    'Network change failed',
    () => {
      setCurrentStep('add-network')
      return `Make sure you have added ${chainName} to Metamask`
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

  const contracts = contractsByChainName[chainName]

  const { abi, address } = contracts[token] || {}

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
      let hash = ''

      if (isNativeToken) {
        const { hash: nativeTxHash } = await sendTransactionAsync({
          to: recipient,
          value: amount,
          chainId,
        })

        hash = nativeTxHash
      } else {
        const { hash: contractTxHash } = await writeAsync({
          args: [recipient, amount],
        })

        hash = contractTxHash
      }

      return hash
    } catch (e) {
      console.error('Transfer error: ', e)
      setCurrentStep('donate-form')
      return
    }
  }

  return { sendTransferTx }
}

const tryParseInt = (decimals?: any) =>
  decimals ? parseInt(decimals.toString()) : undefined

export const useGetBalance = (token: string, chainName: string) => {
  const { address: currentEvmAddress } = useAccount()

  const contracts = contractsByChainName[chainName]

  const { isNativeToken } =
    tokensItems[chainName].find((x) => x.id === token) || {}

  const { address, abi } = contracts[token] || {}
  const chainId = chainIdByChainName[chainName]

  const commonParams = {
    address,
    abi,
    chainId,
  }

  const { data: contractData, isLoading: isContractDataLoading } =
    useContractReads({
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

  const { data: nativeData, isLoading: isNativeDataLoading } = useBalance({
    address: currentEvmAddress,
    watch: true,
  })

  const { balance: contractBalance, decimals: contractDecimals } =
    useMemo(() => {
      if (!contractData) return {}

      const [balance, decimals] = contractData.map((item) => item.result)

      return { balance: balance, decimals }
    }, [!!contractData, isContractDataLoading, token, currentEvmAddress])

  const { balance: nativeBalance, decimals: nativeTokenDecimals } =
    useMemo(() => {
      if (!nativeData) return {}

      const { value, decimals } = nativeData

      return { balance: value, decimals }
    }, [!!nativeData, isNativeDataLoading, token, currentEvmAddress])

  return {
    balance: isNativeToken
      ? nativeBalance?.toString()
      : contractBalance?.toString(),
    decimals: isNativeToken
      ? tryParseInt(nativeTokenDecimals?.toString())
      : tryParseInt(contractDecimals?.toString()),
  }
}
