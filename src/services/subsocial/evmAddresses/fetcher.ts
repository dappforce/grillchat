import { SubsocialQueryData } from '@/subsocial-query/subsocial/query'
import { gql } from 'graphql-request'
import {
  GetEvmAddressesQuery,
  GetEvmAddressesQueryVariables,
} from '../squid/generated'
import { squidRequest } from '../squid/utils'
import { standaloneDynamicFetcherWrapper } from '../utils'
import { getEvmPalletName } from './utils'

async function getEvmAddressesFromBlockchain({
  api,
  data: addresses,
}: SubsocialQueryData<string[]>) {
  const blockchainApi = await api.blockchain.api
  const evmAddresses = await blockchainApi.query[
    getEvmPalletName()
  ].evmAddressByAccount.multi(addresses)
  return evmAddresses.map((x) => x.toHuman() as string)
}

const GET_EVM_ADDRESSES = gql`
  query getEvmAddresses($addresses: [String!]) {
    evmSubstrateAccountLinks(
      where: { substrateAccount: { id_in: $addresses }, active_eq: true }
    ) {
      evmAccount {
        id
      }
      substrateAccount {
        id
      }
    }
  }
`
async function getEvmAddressesFromSquid(addresses: string[]) {
  if (addresses.length === 0) return []
  const res = await squidRequest<
    GetEvmAddressesQuery,
    GetEvmAddressesQueryVariables
  >({
    document: GET_EVM_ADDRESSES,
    variables: { addresses },
  })

  const evmAddressesBySubstrateAddress: Record<string, string> = {}

  const evmAddressesBySubstrateAddressPromise =
    res.evmSubstrateAccountLinks.map((result) => {
      const { evmAccount, substrateAccount } = result

      evmAddressesBySubstrateAddress[substrateAccount.id] = evmAccount.id
    })

  await Promise.all(evmAddressesBySubstrateAddressPromise)

  return addresses.map(
    (address) => evmAddressesBySubstrateAddress[address] || null
  )
}

export const getEvmAddressesFromSubsocial = standaloneDynamicFetcherWrapper({
  blockchain: getEvmAddressesFromBlockchain,
  squid: getEvmAddressesFromSquid,
})
