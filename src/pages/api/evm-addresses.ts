import { getSubsocialApi } from '@/subsocial-query/subsocial/connection'
import { MinimalUsageQueueWithTimeLimit } from '@/utils/data-structure'
import axios from 'axios'
import { request } from 'graphql-request'
import gql from 'graphql-tag'

import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type AccountAddresses = {
  grillAddress: string
  evmAddress: string
  ensName: string | null
  withEnsAvatar: boolean
}

const querySchema = z.object({
  addresses: z.array(z.string()),
})

export type ApiPostsParams = z.infer<typeof querySchema>

export type ApiPostsResponse = {
  success: boolean
  message: string
  errors?: any
  data?: any
  hash?: string
}

const MAX_CACHE_ITEMS = 500_000
const postsCache = new MinimalUsageQueueWithTimeLimit<AccountAddresses>(
  MAX_CACHE_ITEMS,
  5
)

const GET_ENS_NAMES = gql(`
  query GetEnsNames($evmAddresses: [String!]) {
    domains(where: { resolvedAddress_: { id_in: $evmAddresses } }) {
      name
      resolvedAddress {
        id
      }
    }
  }
`)

type Domain = {
  name: string
  resolvedAddress: { id: string }
}

type EnsDomainRequestResult = {
  domains: Domain[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiPostsResponse>
) {
  if (req.method !== 'GET') return res.status(404).end()

  const query = req.query.addresses
  const params = querySchema.safeParse({
    addresses: Array.isArray(query) ? query : [query],
  })

  if (!params.success) {
    return res.status(400).send({
      success: false,
      message: 'Invalid request body',
      errors: params.error.errors,
    })
  }

  const evmAddresses = await getEvmAddressesFromCache(params.data.addresses)
  return res
    .status(200)
    .send({ success: true, message: 'OK', data: evmAddresses })
}

async function checkEnsAvatar(ensName: string | null) {
  if (!ensName) return false

  try {
    const result = await axios.get(
      `https://metadata.ens.domains/mainnet/avatar/${ensName}`
    )
    return !result.data?.message
  } catch {
    return false
  }
}

async function getEnsNames(evmAddresses: string[]) {
  const filteredAddresses = evmAddresses.filter((x) => !!x)

  const result = (await request({
    url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    document: GET_ENS_NAMES,
    variables: { evmAddresses: filteredAddresses },
  })) as EnsDomainRequestResult

  const domainsEntity: Record<string, string> = {}

  result.domains.forEach(({ resolvedAddress: { id: evmAddress }, name }) => {
    domainsEntity[evmAddress] = name
  })

  return domainsEntity
}

export async function getEvmAddressesFromCache(addresses: string[]) {
  const evmAddressBySubstrateAddress: AccountAddresses[] = []
  const needToFetchIds: string[] = []

  let newlyFetchedData: AccountAddresses[] = []
  addresses.forEach((address) => {
    const cachedData = postsCache.get(address)
    if (cachedData) {
      evmAddressBySubstrateAddress.push(cachedData)
    } else {
      needToFetchIds.push(address)
    }
  })

  if (needToFetchIds.length > 0) {
    try {
      const subsocialApi = await getSubsocialApi()

      const api = await subsocialApi.blockchain.api
      const evmAddressses =
        await api.query.evmAccounts.evmAddressByAccount.multi(needToFetchIds)

      const evmAddresssesHuman = evmAddressses.map((x) => x.toHuman() as string)

      const domains = await getEnsNames(evmAddresssesHuman)

      const needToFetchIdsPromise = needToFetchIds.map(async (address, i) => {
        const evmAddress = evmAddresssesHuman[i]

        const ensName = domains?.[evmAddress] || null

        const accountAddresses = {
          grillAddress: address,
          evmAddress: evmAddresssesHuman[i],
          ensName,
          withEnsAvatar: await checkEnsAvatar(ensName),
        }

        newlyFetchedData.push(accountAddresses)
        postsCache.add(address, accountAddresses)
      })

      await Promise.all(needToFetchIdsPromise)
    } catch (e) {
      console.error(
        'Error fetching posts from Subsocial API: ',
        needToFetchIds,
        e
      )
      return evmAddressBySubstrateAddress
    }
  }
  return [...evmAddressBySubstrateAddress, ...newlyFetchedData]
}
