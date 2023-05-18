import { SubsocialQueryData, createSubsocialQuery } from '@/subsocial-query/subsocial/query'

const getLinkedEvmAddress = async (params: SubsocialQueryData<string>): Promise<string> => {
  const { api: subsocialApi, data } = params

  const api = await subsocialApi.blockchain.api

  const linkedAddresses = await api.query.evmAccounts.evmAddressByAccount(data)

  return linkedAddresses?.toString()
}

export const getLinkedEvmAddressQuery = createSubsocialQuery({
  key: 'getLinkedEvmAddress',
  fetcher: getLinkedEvmAddress,
})
