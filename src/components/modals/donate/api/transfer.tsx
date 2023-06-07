import { parseEther } from 'viem'
import { useAccount, useConnect, useContractWrite } from 'wagmi'
import { polygonContractsByToken } from './config'

export const useTransfer = (token: string) => {
  const { isConnected } = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { writeAsync } = useContractWrite({
    ...polygonContractsByToken[token],
    functionName: 'transfer',
  } as any)

  const sendTransferTx = async (recipient: string, amount: string) => {
    if (!isConnected) {
      await connectAsync({ connector: connectors[0] })
    }
    try {
      await writeAsync({
        args: [recipient, parseEther(`${parseFloat(amount)}`)],
      })
    } catch (e) {
      console.error(e)
    }
  }

  return { sendTransferTx }
}
