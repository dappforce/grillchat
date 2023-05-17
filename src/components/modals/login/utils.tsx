import { _TypedDataEncoder } from "@ethersproject/hash"
import { decodeAddress } from "@polkadot/keyring"
import { useSignMessage } from "wagmi"

export function buildMsgParams(evmAddress: string, substrateAddress: Uint8Array) {
  const domain = {
    name: 'SubSocial Evm Address Linkage',
    version: '1',
    salt: '0x1333ee260a234d3a246b85239e279bbdc7618db7188f2dd73f7322963fcd4d02',
  }

  const types = {
    Transaction: [
      { name: 'transactionName', type: 'string' },
      { name: 'substrateAddress', type: 'bytes' },
      { name: 'evmAddress', type: 'bytes' },
    ],
  }

  const value = {
    transactionName: 'LinkEvmAddress',
    substrateAddress,
    evmAddress,
  }

  return JSON.stringify(_TypedDataEncoder.getPayload(domain, types, value))
}

export const useSignEvmLinkMessage = () => {
  const { signMessage, data, isLoading } = useSignMessage()

  const signEvmLinkMessage = (emvAddress?: string, substrateAddress?: string | null) => {
    if (!emvAddress || !substrateAddress) return

    const decodedAddress = decodeAddress(substrateAddress)
    const message = buildMsgParams(emvAddress, decodedAddress)
    signMessage({ message })
  }

  return { signEvmLinkMessage, isLoading }
}