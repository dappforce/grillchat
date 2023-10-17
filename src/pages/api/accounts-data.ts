import { redisCallWrapper } from '@/server/cache'
import { getEvmAddressesFromSubsocial } from '@/services/subsocial/evmAddresses/fetcher'
import { request } from 'graphql-request'
import gql from 'graphql-tag'

import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type AccountData = {
  grillAddress: string
  evmAddress: string | null
  ensName: string | null
}

const querySchema = z.object({
  addresses: z.array(z.string()),
})

export type ApiAccountsDataParams = z.infer<typeof querySchema>

export type ApiAccountDataResponse = {
  success: boolean
  message: string
  errors?: any
  data?: AccountData[]
  hash?: string
}

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

const MAX_AGE = 60 * 60 // 1 hour
const getRedisKey = (address: string) => {
  return `accounts-data:${address}`
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiAccountDataResponse>
) {
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

  const addresses = params.data.addresses

  if (req.method === 'POST') {
    invalidateCache(addresses)
    return res.status(200).send({ success: true, message: 'OK' })
  } else {
    const accountsData = await getAccountsDataFromCache(
      addresses,
      req.method as 'POST' | 'GET'
    )

    return res
      .status(200)
      .send({ success: true, message: 'OK', data: accountsData })
  }
}

function invalidateCache(addresses: string[]) {
  addresses.forEach((address) => {
    redisCallWrapper((redis) => redis?.del(getRedisKey(address)))
  })
}

type Domain = {
  name: string
  resolvedAddress: { id: string }
}

type EnsDomainRequestResult = {
  domains: Domain[]
}

async function getEnsNames(evmAddresses: (string | null)[]) {
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

async function fetchAccountsData(addresses: string[], method: 'POST' | 'GET') {
  let newlyFetchedData: AccountData[] = []

  try {
    let evmAddressesHuman: (string | null)[] = []
    try {
      evmAddressesHuman = await getEvmAddressesFromSubsocial(
        addresses,
        method === 'POST' ? 'squid' : 'blockchain'
      )
    } catch (e) {
      console.error(
        'Error fetching evm addresses, trying to fetch from blockchain',
        e
      )

      evmAddressesHuman = await getEvmAddressesFromSubsocial(
        addresses,
        'blockchain'
      )
    }

    const domains = await getEnsNames(evmAddressesHuman)

    const needToFetchIdsPromise = addresses.map(async (address, i) => {
      const evmAddress = evmAddressesHuman[i]

      const ensName = evmAddress ? domains?.[evmAddress] || null : null

      const accountData = {
        grillAddress: address,
        evmAddress: evmAddressesHuman[i],
        ensName,
      }

      newlyFetchedData.push(accountData)
      redisCallWrapper((redis) =>
        redis?.set(
          getRedisKey(address),
          JSON.stringify(accountData),
          'EX',
          MAX_AGE
        )
      )
    })

    await Promise.all(needToFetchIdsPromise)

    return newlyFetchedData
  } catch (e) {
    console.error(
      'Error fetching accounts data from Subsocial API: ',
      addresses,
      e
    )
    return []
  }
}

export async function getAccountsDataFromCache(
  addresses: string[],
  method: 'POST' | 'GET'
) {
  const evmAddressByGrillAddress: AccountData[] = []
  const needToFetchIds: string[] = []

  let newlyFetchedData: AccountData[] = []

  const promises = addresses.map(async (address) => {
    const cachedData = await redisCallWrapper((redis) =>
      redis?.get(getRedisKey(address))
    )

    if (cachedData) {
      const parsedData = JSON.parse(cachedData) as AccountData
      evmAddressByGrillAddress.push(parsedData)
    } else {
      needToFetchIds.push(address)
    }
  })
  await Promise.all(promises)

  if (needToFetchIds.length > 0) {
    newlyFetchedData = await fetchAccountsData(needToFetchIds, method)
  }

  return [...evmAddressByGrillAddress, ...newlyFetchedData]
}
