import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyAccount } from '@/stores/my-account'
import { useMemo } from 'react'
import { parseEther } from 'viem'
import {
  useAccount,
  useConnect,
  useContractReads,
  useContractWrite,
  useSendTransaction,
} from 'wagmi'
import { chainIdByChainName, polygonContractsByToken } from './config'

export const useTransfer = (token: string, chainName: string) => {
  const { isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { sendTransactionAsync } = useSendTransaction()
  const { writeAsync } = useContractWrite({
    ...polygonContractsByToken[token],
    functionName: 'transfer',
  } as any)

  const sendTransferTx = async (
    recipient: string,
    amount: string,
    isNativeToken?: boolean
  ) => {
    if (!isConnected) {
      await connectAsync({
        connector: connectors[0],
        chainId: chainIdByChainName[chainName],
      })
    }

    try {
      const { hash } = isNativeToken
        ? await sendTransactionAsync({
            to: recipient,
            value: parseEther(`${parseFloat(amount)}`),
          })
        : await writeAsync({
            args: [recipient, parseEther(`${parseFloat(amount)}`)],
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

  const { data, isLoading } = useContractReads({
    contracts: [
      {
        ...polygonContractsByToken[token],
        functionName: 'balanceOf',
        args: evmAddress ? [evmAddress] : [],
      },
      {
        ...polygonContractsByToken[token],
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
