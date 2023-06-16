import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'
import {
  Connector,
  useAccount,
  useConnect,
  useContractReads,
  useContractWrite,
  useNetwork,
  useSendTransaction,
} from 'wagmi'
import { isTouchDevice } from '../../../../utils/device'
import { DonateModalStep } from '../DonateModal'
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

export const useDonate = (token: string, chainName: string) => {
  const { isConnected } = useAccount()
  const { connectToWallet } = useConnectToWallet()

  const { chains } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()

  const { abi, address } = polygonContractsByToken[token]

  const { writeAsync } = useContractWrite({
    address,
    abi,
    functionName: 'transfer',
    chainId: chainIdByChainName[chainName],
  } as any)

  const sendTransferTx = async (
    recipient: string,
    amount: bigint,
    setCurrentStep: (currentStep: DonateModalStep) => void,
    isNativeToken?: boolean,
    decimals?: number
  ) => {
    const connector = getConnector({ chains })
    setCurrentStep('processing')
    if (!isConnected) {
      await connectToWallet(chainName, connector)
    }

    try {
      if (!decimals) return
      isTouchDevice() && (await openMobileWallet({ connector }))

      const { hash } = isNativeToken
        ? await sendTransactionAsync({
            to: recipient,
            value: amount,
            chainId: chainIdByChainName[chainName],
          })
        : await writeAsync({
            args: [recipient, amount],
          })

      return hash
    } catch (e) {
      console.error('Transfer error: ', e)
      setCurrentStep('donate')
      return
    }
  }

  return { sendTransferTx }
}

export const useGetBalance = (token: string) => {
  const myGrillAddress = useMyAccount((state) => state.address)

  const { data: accountData } = getAccountDataQuery.useQuery(
    myGrillAddress || ''
  )

  const { evmAddress } = accountData || {}

  const { address, abi } = polygonContractsByToken[token]

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        address,
        abi,
        functionName: 'balanceOf',
        args: evmAddress ? [evmAddress] : [],
      },
      {
        address,
        abi,
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
