import { useLinkEvmAddress } from '@/services/subsocial/evmAddresses/mutation'
import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { decodeAddress } from '@polkadot/keyring'
import { BN, u8aToHex } from '@polkadot/util'
import { useEffect, useState } from 'react'
import { useDisconnect, useSignMessage } from 'wagmi'

const buildMsgParams = async (substrateAddress: string) => {
  const decodedAddress = u8aToHex(decodeAddress(substrateAddress))
  const subsocialApi = await getSubsocialApi()

  const api = await subsocialApi.blockchain.api

  const account = await api.query.system.account(substrateAddress)

  const nonce = account.nonce.add(new BN(1)).toString()

  const decodedAddressHex = decodedAddress.replace('0x', '')

  return `Link to Subsocial address ${decodedAddressHex} (in hex) with nonce ${nonce}`
}

const useSignEvmLinkMessage = () => {
  const { signMessageAsync } = useSignMessage()
  const [isSigningMessage, setIsSigningMessage] = useState(false)
  const [isError, setIsError] = useState(false)

  const signEvmLinkMessage = async (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => {
    setIsError(false)

    if (!emvAddress || !substrateAddress) return

    const message = await buildMsgParams(substrateAddress)
    try {
      setIsSigningMessage(true)
      const data = await signMessageAsync({ message })

      setIsSigningMessage(false)
      return data.toString()
    } catch {
      setIsError(true)
      setIsSigningMessage(false)
      return
    }
  }

  return { signEvmLinkMessage, isSigningMessage, isError }
}

type SignMessageAndLinkAddressProps = {
  setModalStep?: () => void
  onError?: () => void
  linkedEvmAddress?: string
}

export default function useSignMessageAndLinkEvmAddress({
  setModalStep,
  onError,
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
  } = useLinkEvmAddress({
    setModalStep,
    onError,
    linkedEvmAddress,
  })

  useEffect(() => {
    if (isSignMessageError) {
      if (!linkedEvmAddress) {
        disconnect()
      }
      onError?.()
    }
  }, [isSignMessageError, linkEvmAddress])

  const signAndLinkEvmAddress = async (
    evmAddress?: string,
    substrateAddress?: string | null
  ) => {
    if (!evmAddress) return

    const data = await signEvmLinkMessage(evmAddress, substrateAddress)

    if (data) {
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
