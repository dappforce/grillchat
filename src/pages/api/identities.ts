import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getKiltApi, getSubIdRequest, squidRequest } from '@/server/external'
import { encodeAddress } from '@polkadot/keyring'
import { gql } from 'graphql-request'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  addresses: z.array(z.string()).or(z.string()),
})
export type ApiIdentitiesParams = z.infer<typeof querySchema>

export type Identities = {
  address: string
  polkadot?: string
  kusama?: string
  kilt?: string
  subsocial?: string[]
}
type ResponseData = {
  data?: Identities[]
}
export type ApiIdentitiesResponse = ApiResponse<ResponseData>
export type ApiIdentitiesInvalidationResponse = ApiResponse<{}>

export default handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const addresses = Array.isArray(data.addresses)
      ? data.addresses
      : [data.addresses]

    const identities = await getIdentities(addresses)
    console.log('done finished')
    return res
      .status(200)
      .send({ success: true, message: 'OK', data: identities })
  },
})

async function getIdentities(addresses: string[]): Promise<Identities[]> {
  const [identitiesPromise, kiltIdentitiesPromise, subsocialPromise] =
    await Promise.allSettled([
      getPolkadotAndKusamaIdentities(addresses),
      getKiltIdentities(addresses),
      getSubsocialUsernames(addresses),
    ] as const)
  const identities =
    identitiesPromise.status === 'fulfilled' ? identitiesPromise.value : {}
  const kiltIdentities =
    kiltIdentitiesPromise.status === 'fulfilled'
      ? kiltIdentitiesPromise.value
      : {}
  const subsocialIdentities =
    subsocialPromise.status === 'fulfilled' ? subsocialPromise.value : {}

  console.log('finished')
  return addresses.map((address) => {
    const polkadot = identities[address]?.polkadot
    const kusama = identities[address]?.kusama
    const kilt = kiltIdentities[address]
    const subsocialUsernames = subsocialIdentities[address]
    return {
      address,
      polkadot,
      kusama,
      kilt,
      subsocial: subsocialUsernames,
    }
  })
}

const MAX_AGE = 60 * 60 // 1 hour
const getIdentitiesRedisKey = (
  id: string,
  type: 'polkadot' | 'kilt' | 'subsocial'
) => {
  return `identities:${type}:${id}`
}
async function getPolkadotAndKusamaIdentities(addresses: string[]) {
  const names: Record<string, { polkadot?: string; kusama?: string }> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'polkadot'))
    )
    console.log('POLKADOT: get cached data', cached, address)
    try {
      if (cached) {
        const parsed = JSON.parse(cached) as {
          polkadot?: string
          kusama?: string
        }
        names[address] = parsed
        return
      }
    } catch {}
    needToFetchAddresses.push(address)
  })
  await Promise.allSettled(cachePromises)

  if (needToFetchAddresses.length === 0) return names

  let usedAddressesToFetch = needToFetchAddresses
  // subid api right now can't accept only 1 address
  if (usedAddressesToFetch.length === 1) {
    usedAddressesToFetch.push(usedAddressesToFetch[0])
  }
  // sub id uses address format with 42 prefix
  usedAddressesToFetch = usedAddressesToFetch.map((address) =>
    encodeAddress(address, 42)
  )
  const res = await getSubIdRequest().get(
    '/identities?' + usedAddressesToFetch.map((n) => `accounts=${n}`).join('&')
  )
  const identities = res.data
  needToFetchAddresses.forEach((address) => {
    const convertedAddress = encodeAddress(address, 42)
    if (!identities[convertedAddress]) return

    const identity = identities[convertedAddress] as Record<
      'polkadot' | 'kusama',
      { info?: { display?: string } }
    >
    const savedIdentity: { polkadot?: string; kusama?: string } = {}
    if (identity?.polkadot?.info?.display) {
      savedIdentity.polkadot = identity.polkadot.info.display
    }
    if (identity?.kusama?.info?.display) {
      savedIdentity.kusama = identity.kusama.info.display
    }
    console.log(
      'POLKADOT: setting cached data',
      JSON.stringify(savedIdentity),
      address
    )
    redisCallWrapper((redis) =>
      redis?.set(
        getIdentitiesRedisKey(address, 'polkadot'),
        JSON.stringify(savedIdentity),
        'EX',
        MAX_AGE
      )
    )
    names[address] = savedIdentity
  })

  console.log('POLKADOT FINISHED')
  return names
}

async function getKiltIdentities(addresses: string[]) {
  const w3names: Record<string, string | undefined> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'kilt'))
    )
    console.log('KILT: get cached data', cached, address)
    try {
      if (cached) {
        const parsed = JSON.parse(cached) as { name?: string }
        w3names[address] = parsed.name
        return
      }
    } catch {}
    needToFetchAddresses.push(address)
  })
  await Promise.allSettled(cachePromises)

  const identities = await Promise.allSettled(
    needToFetchAddresses.map((address) => {
      return queryAccountWeb3Name(address)
    })
  )

  identities.forEach((namePromise, i) => {
    let name: string | undefined = undefined
    const address = needToFetchAddresses[i]

    if (namePromise.status === 'fulfilled') {
      name = namePromise.value
    }

    redisCallWrapper((redis) =>
      redis?.set(
        getIdentitiesRedisKey(address, 'kilt'),
        JSON.stringify({ name }),
        'EX',
        MAX_AGE
      )
    )
    if (name) w3names[address] = name
  })

  console.log('KILT FINISHED')
  return w3names
}

export async function queryAccountWeb3Name(
  lookupAccountAddress: string
): Promise<string | undefined> {
  const api = await getKiltApi()

  const didDetails: any = await api.call.did.queryByAccount({
    AccountId32: lookupAccountAddress,
  })
  if (didDetails.isNone) {
    throw new Error(`No DID for the KILT account "${lookupAccountAddress}".`)
  }

  const { w3n } = didDetails.unwrap()
  if (w3n.isNone) {
    return undefined
  }

  const web3Name = w3n.unwrap().toHuman()
  return web3Name
}

async function getSubsocialUsernames(addresses: string[]) {
  const usernamesMap: Record<string, string[]> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'subsocial'))
    )
    console.log('SUBSOCIAL: get cached data', cached, address)
    try {
      if (cached) {
        const parsed = JSON.parse(cached) as string[]
        usernamesMap[address] = parsed
        return
      }
    } catch {}
    needToFetchAddresses.push(address)
  })
  await Promise.allSettled(cachePromises)

  type SubsocialAccount = { id: string; usernames: string[] }
  const res = (await squidRequest({
    document: gql`
      query GetAccountUsernames($addresses: [String!]!) {
        accounts(where: { id_in: $addresses }) {
          id
          usernames
        }
      }
    `,
    variables: { addresses: needToFetchAddresses },
  })) as { accounts: SubsocialAccount[] }

  const accountsMap: Record<string, SubsocialAccount> = {}
  res.accounts.forEach((account) => {
    accountsMap[account.id] = account
  })

  needToFetchAddresses.forEach((address) => {
    const account = accountsMap[address]
    const { id, usernames = [] } = account || {}

    console.log('SUBSOCIAL: setting cached data', JSON.stringify(usernames), id)
    redisCallWrapper((redis) =>
      redis?.set(
        getIdentitiesRedisKey(id, 'subsocial'),
        JSON.stringify(usernames),
        'EX',
        MAX_AGE
      )
    )
    if (usernames.length > 0) usernamesMap[id] = usernames
  })

  console.log('SUBSOCIAL FINISHED')
  return usernamesMap
}
