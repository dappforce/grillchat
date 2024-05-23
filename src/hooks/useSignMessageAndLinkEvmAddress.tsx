import { useLinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { decodeAddress } from '@polkadot/keyring'
import { u8aToHex } from '@polkadot/util'
import { useEffect, useState } from 'react'
import { useDisconnect, useSignMessage } from 'wagmi'
import useToastError from './useToastError'

const buildMsgParams = async (substrateAddress: string) => {
  const decodedAddress = u8aToHex(decodeAddress(substrateAddress))
  const subsocialApi = await getSubsocialApi()

  const api = await subsocialApi.blockchain.api

  const account = await api.query.system.account(substrateAddress)

  let nonce = account.nonce.addn(1).toString()

  const decodedAddressHex = decodedAddress.replace('0x', '')

  return `Link to Subsocial address ${decodedAddressHex} (in hex) with nonce ${nonce}`
}

const useSignEvmLinkMessage = () => {
  const { signMessageAsync } = useSignMessage()
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const [isError, setIsError] = useState(false)

  const signEvmLinkMessage = async (
    evmAddress?: string,
    substrateAddress?: string | null
  ) => {
    setIsError(false)

    if (!evmAddress || !substrateAddress) return

    const message = await buildMsgParams(substrateAddress)
    try {
      setIsSigningMessage(true)
      const data = await signMessageAsync({ message })

      setIsSigningMessage(false)
      return data.toString()
    } catch (e: any) {
      setIsError(true)
      console.error('Signing evm link message error:', e.message)
      setIsSigningMessage(false)
      return
    }
  }

  return { signEvmLinkMessage, isSigningMessage, isError }
}

type SignMessageAndLinkAddressProps = {
  onSuccess?: () => void
  onFinishSignMessage?: () => void
  onError?: () => void
  linkedEvmAddress?: string | null
}

export default function useSignMessageAndLinkEvmAddress({
  onSuccess,
  onError,
  onFinishSignMessage,
  linkedEvmAddress,
}: SignMessageAndLinkAddressProps) {
  const {
    signEvmLinkMessage,
    isSigningMessage,
    isError: isSignMessageError,
  } = useSignEvmLinkMessage()
  const { disconnect } = useDisconnect()

  const {
    mutate: linkEvmAddress,
    isLoading: isLinkingEvmAddress,
    onCallbackLoading,
    error,
  } = useLinkEvmAddress({
    onSuccess,
    onError,
    linkedEvmAddress,
  })
  useToastError(error, error?.message || 'Failed to connect EVM')

  useEffect(() => {
    if (isSignMessageError) {
      if (!linkedEvmAddress) {
        disconnect()
      }
      onError?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignMessageError, linkEvmAddress])

  const signAndLinkEvmAddress = async (
    evmAddress?: string,
    substrateAddress?: string | null
  ) => {
    if (!evmAddress) return

    const data = await signEvmLinkMessage(evmAddress, substrateAddress)
    if (data) {
      onFinishSignMessage?.()
      linkEvmAddress({
        evmAddress,
        evmSignature: data,
      })
    }
  }

  return {
    signAndLinkEvmAddress,
    isLoading: onCallbackLoading || isSigningMessage || isLinkingEvmAddress,
  }
}
