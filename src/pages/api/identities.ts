import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getKiltApi } from '@/server/external'
import axios from 'axios'
import { NextApiRequest } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  addresses: z.array(z.string()).or(z.string()),
})
export type ApiIdentitiesParams = z.infer<typeof querySchema>

export type Identities = {
  address: string
  polkadot?: string
  kilt?: string
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
    return res
      .status(200)
      .send({ success: true, message: 'OK', data: identities })
  },
})

async function getIdentities(addresses: string[]): Promise<Identities[]> {
  const [identitiesPromise, kiltIdentitiesPromise] = await Promise.allSettled([
    getPolkadotAndKusamaIdentities(addresses),
    getKiltIdentities(addresses),
  ] as const)
  const identities =
    identitiesPromise.status === 'fulfilled' ? identitiesPromise.value : {}
  const kiltIdentities =
    kiltIdentitiesPromise.status === 'fulfilled'
      ? kiltIdentitiesPromise.value
      : {}

  return addresses.map((address) => ({
    address,
    polkadot: identities[address]?.polkadot,
    kusama: identities[address]?.kusama,
    kilt: kiltIdentities[address],
  }))
}

const MAX_AGE = 60 * 60 // 1 hour
const getIdentitiesRedisKey = (id: string, type: 'polkadot' | 'kilt') => {
  return `identities:${type}:${id}`
}
async function getPolkadotAndKusamaIdentities(addresses: string[]) {
  const names: Record<string, { polkadot?: string; kusama?: string }> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'polkadot'))
    )
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
  await Promise.all(cachePromises)

  if (needToFetchAddresses.length === 0) return names

  const usedAddressesToFetch = needToFetchAddresses
  // subid api right now can't accept only 1 address
  if (usedAddressesToFetch.length === 1) {
    usedAddressesToFetch.push(usedAddressesToFetch[0])
  }
  const res = await axios.get(
    'https://sub.id/api/v1/identities?' +
      needToFetchAddresses.map((n) => `accounts=${n}`).join('&')
  )
  const identities = res.data
  needToFetchAddresses.forEach((address) => {
    if (!identities[address]) return

    const identity = identities[address] as Record<
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
    redisCallWrapper((redis) =>
      redis?.set(
        getIdentitiesRedisKey(address, 'polkadot'),
        JSON.stringify({ name }),
        'EX',
        MAX_AGE
      )
    )
    names[address] = savedIdentity
  })

  return names
}

async function getKiltIdentities(addresses: string[]) {
  const w3names: Record<string, string | undefined> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'kilt'))
    )
    try {
      if (cached) {
        const parsed = JSON.parse(cached) as { name?: string }
        w3names[address] = parsed.name
        return
      }
    } catch {}
    needToFetchAddresses.push(address)
  })
  await Promise.all(cachePromises)

  const identities = await Promise.all(
    needToFetchAddresses.map((address) => {
      return queryAccountWeb3Name(address)
    })
  )

  identities.forEach((name, i) => {
    const address = needToFetchAddresses[i]
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
