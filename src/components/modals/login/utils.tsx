import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { _TypedDataEncoder } from '@ethersproject/hash'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { BN, numberToHex, u8aToHex } from '@polkadot/util'
import { useState } from 'react'
import { useSignMessage } from 'wagmi'

export const buildMsgParams = async (substrateAddress: string) => {
  const decodedAddress = u8aToHex(decodeAddress(substrateAddress))
  const subsocialApi = await getSubsocialApi()

  const api = await subsocialApi.blockchain.api

  const account = await api.query.system.account(substrateAddress)

  const nonce = account.nonce.add(new BN(1)).toString()

  return `Link to Subsocial address ${decodedAddress.replace('0x', '')} (in hex) with nonce ${nonce}`
}

export const useSignEvmLinkMessage = () => {
  const { signMessageAsync } = useSignMessage()
  const [isSigningMessage, setIsSigningMessage] = useState(false)

  const signEvmLinkMessage = async (
    emvAddress?: string,
    substrateAddress?: string | null
  ) => {
    if (!emvAddress || !substrateAddress) return

    const message = await buildMsgParams(substrateAddress)
    try {
      setIsSigningMessage(true)
      const data = await signMessageAsync({ message })

      setIsSigningMessage(false)
      return data.toString()
    } catch {
      setIsSigningMessage(false)
      return
    }
  }

  return { signEvmLinkMessage, isSigningMessage }
}
