import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { isTouchDevice } from '@/utils/device'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'
import { useMemo } from 'react'
import { parseUnits } from 'viem'
import {
  useAccount,
  useConnect,
  useContractReads,
  useContractWrite,
  useNetwork,
  useSendTransaction,
} from 'wagmi'
import { chainIdByChainName, polygonContractsByToken } from './config'

export const useTransfer = (token: string, chainName: string) => {
  const { isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { chains } = useNetwork()
  const { sendTransactionAsync } = useSendTransaction()

  const { abi, address } = polygonContractsByToken[token]

  const { writeAsync } = useContractWrite({
    address,
    abi,
    functionName: 'transfer',
  } as any)

  const sendTransferTx = async (
    recipient: string,
    amount: string,
    isNativeToken?: boolean,
    decimals?: number
  ) => {
    if (!isConnected) {
      const connectorsCustom = connectorsForWallets([
        {
          groupName: 'Recommended',
          wallets: [walletConnectWallet({ chains })],
        },
      ])()

      try {
        console.log('hello')
        const result = await connectAsync({
          connector: isTouchDevice() ? connectorsCustom[0] : connectors[0],
          chainId: chainIdByChainName[chainName],
        })

        console.log('Result ', result.account)
      } catch (e) {
        console.error(e)
      }
    }

    try {
      if (!decimals) return

      const { hash } = isNativeToken
        ? await sendTransactionAsync({
            to: recipient,
            value: parseUnits(`${parseFloat(amount)}`, decimals),
          })
        : await writeAsync({
            args: [recipient, parseUnits(`${parseFloat(amount)}`, decimals)],
          })

      return hash
    } catch (e) {
      console.error(e)
      return
    }
  }

  return { sendTransferTx }
}

export const useGetBalance = (token: string) => {
  const myGrillAddress = useMyAccount((state) => state.address)

  const { data: accountData } = getAccountDataQuery.useQuery(myGrillAddress)

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
