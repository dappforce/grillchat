import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { useEffect, useMemo } from 'react'
import {
  Connector,
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
import { getConnector, openMobileWallet, RainbowKitConnector } from './utils'

export const useConnectToWallet = () => {
  const { connectAsync } = useConnect()

  const connectToWallet = async (
    chainName: string,
    connector: RainbowKitConnector<Connector<any, any>>
  ) => {
    try {
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

      await connectAsync({
        connector: connector.connector,
        chainId: chainIdByChainName[chainName],
      })
    } catch (e) {
      console.error('Connecting error: ', e)
    }
  }
  return { connectToWallet }
}

export const useSwitchWalletNetwork = () => {
  const { switchNetworkAsync } = useSwitchNetwork()

  const switchNetwork = async (
    chainName: string,
    connector: RainbowKitConnector<Connector<any, any>>
  ) => {
    try {
      isTouchDevice() && (await openMobileWallet({ connector }))

      await switchNetworkAsync?.(chainIdByChainName[chainName])
    } catch (e) {
      console.error('Switch network error: ', e)
    }
  }

  return { switchNetwork }
}

export const useConnectOrSwitchNetwork = (
  setCurrentStep: (currentStep: DonateModalStep) => void,
  chainName: string
) => {
  const { isConnected } = useAccount()
  const { chains } = useNetwork()

  const destChainId = chainIdByChainName[chainName]
  const connector = getConnector({ chains })

  const { switchNetwork, isLoading: isSwitchNetworkLoading } =
    useSwitchNetwork()

  const { connect, isLoading: isConnectLoading } = useConnect()

  console.log('isConnectLoading', isConnectLoading, isConnected)

  useEffect(() => {
    console.log(isSwitchNetworkLoading, isConnectLoading)
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

      connect({ connector: connector.connector })
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
    // const connector = getConnector({ chains })
    setCurrentStep('wallet-action-required')

    try {
      if (!decimals) return
      // isTouchDevice() && (await openMobileWallet({ connector }))
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
