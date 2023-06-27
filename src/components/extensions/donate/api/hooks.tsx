import Toast from '@/components/Toast'
import useToastError from '@/hooks/useToastError'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'
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
import {
  getConnector,
  getWalletFromStorage,
  openMobileWallet,
  tryParseDecimals,
} from './utils'

export const useConnectOrSwitchNetwork = (
  setCurrentStep: (currentStep: DonateModalStep) => void,
  chainName: string
) => {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()

  const destChainId = chainIdByChainName[chainName]
  const connector = getConnector()

  const {
    switchNetwork,
    isLoading: isSwitchNetworkLoading,
    error: switchNetworkError,
  } = useSwitchNetwork()

  const { isLoading: isConnectLoading, error: connectWalletError } = useConnect(
    {
      onSuccess: async ({ chain }) => {
        const currentChainId = chain.id

        if (currentChainId !== destChainId) {
          isTouchDevice() && (await openMobileWallet({ connector }))
          switchNetwork?.(destChainId)
        }
      },
    }
  )

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
      openConnectModal?.()
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
  const { switchNetwork } = useSwitchNetwork()

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
    if (getWalletFromStorage() === 'subwallet') switchNetwork?.(chainId)

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
    } catch (e: any) {
      console.error('Transfer error: ', e)
      setCurrentStep('donate-form')
      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => (
            <HiOutlineExclamationTriangle className={classNames} />
          )}
          title={'Donation error'}
          description={e.message}
        />
      ))
      return
    }
  }

  return { sendTransferTx }
}

type GetBalanceProps = {
  chainName: string
  token: string
}

const useGetNativeTokenBalance = ({ chainName, token }: GetBalanceProps) => {
  const { address: currentEvmAddress } = useAccount()

  const chainId = chainIdByChainName[chainName]

  const { data, isLoading } = useBalance({
    address: currentEvmAddress,
    watch: true,
    chainId,
  })

  return useMemo(() => {
    if (!data) return {}

    const { value, decimals } = data

    return { balance: value, decimals }
  }, [!!data, isLoading, token, currentEvmAddress, chainName])
}

const useGetContractTokenBalance = ({ chainName, token }: GetBalanceProps) => {
  const { address: currentEvmAddress } = useAccount()

  const chainId = chainIdByChainName[chainName]

  const contracts = contractsByChainName[chainName]
  const { address, abi } = contracts[token] || {}

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

  return useMemo(() => {
    if (!data) return {}

    const [balance, decimals] = data.map((item) => item.result)

    return { balance: balance, decimals }
  }, [!!data, isLoading, token, currentEvmAddress, chainName])
}

export const useGetBalance = (token: string, chainName: string) => {
  const { balance: contractBalance, decimals: contractDecimals } =
    useGetContractTokenBalance({ token, chainName })
  const { balance: nativeBalance, decimals: nativeTokenDecimals } =
    useGetNativeTokenBalance({ token, chainName })

  const { isNativeToken } =
    tokensItems[chainName].find((x) => x.id === token) || {}

  return {
    balance: isNativeToken
      ? nativeBalance?.toString()
      : contractBalance?.toString(),
    decimals: isNativeToken
      ? tryParseDecimals(nativeTokenDecimals?.toString())
      : tryParseDecimals(contractDecimals?.toString()),
  }
}
