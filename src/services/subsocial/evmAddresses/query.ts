import { AccountAddresses } from '@/pages/api/evm-addresses'
import { createQuery, poolQuery } from '@/subsocial-query'
import {
  createSubsocialQuery,
  SubsocialQueryData,
} from '@/subsocial-query/subsocial/query'
import axios from 'axios'

const getLinkedEvmAddress = async (
  params: SubsocialQueryData<string>
): Promise<string> => {
  const { api: subsocialApi, data } = params

  const api = await subsocialApi.blockchain.api

  const linkedAddresses = await api.query.evmAccounts.evmAddressByAccount(data)

  return linkedAddresses?.toString()
}

export const getLinkedEvmAddressQuery = createSubsocialQuery({
  key: 'getLinkedEvmAddress',
  fetcher: getLinkedEvmAddress,
})

export async function getEvmAddresses(addresses: string[]) {
  const requestedIds = addresses.filter((id) => !!id)
  if (requestedIds.length === 0) return []
  const res = await axios.get(
    '/api/evm-addresses?' + requestedIds.map((n) => `addresses=${n}`).join('&')
  )

  return res.data.data as AccountAddresses[]
}

const getEvmAddress = poolQuery<string, AccountAddresses>({
  multiCall: async (addresses) => {
    if (addresses.length === 0) return []
    return getEvmAddresses(addresses)
  },
  resultMapper: {
    paramToKey: (address) => address,
    resultToKey: (result) => result?.grillAddress ?? '',
  },
})
export const getEvmAddressQuery = createQuery({
  key: 'getEvmAddress',
  fetcher: getEvmAddress,
})
