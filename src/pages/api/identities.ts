import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getKiltApi, getPolkadotApi } from '@/server/external'
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
  const [polkadotIdentitiesPromise, kiltIdentitiesPromise] =
    await Promise.allSettled([
      getPolkadotIdentities(addresses),
      getKiltIdentities(addresses),
    ] as const)
  const polkadotIdentities =
    polkadotIdentitiesPromise.status === 'fulfilled'
      ? polkadotIdentitiesPromise.value
      : {}
  const kiltIdentities =
    kiltIdentitiesPromise.status === 'fulfilled'
      ? kiltIdentitiesPromise.value
      : {}

  return addresses.map((address) => ({
    address,
    polkadot: polkadotIdentities[address],
    kilt: kiltIdentities[address],
  }))
}

const MAX_AGE = 60 * 60 // 1 hour
const getIdentitiesRedisKey = (id: string, type: 'polkadot' | 'kilt') => {
  return `identities:${type}:${id}`
}
async function getPolkadotIdentities(addresses: string[]) {
  const api = await getPolkadotApi()
  const names: Record<string, string | undefined> = {}

  const needToFetchAddresses: string[] = []
  const cachePromises = addresses.map(async (address) => {
    const cached = await redisCallWrapper((redis) =>
      redis?.get(getIdentitiesRedisKey(address, 'polkadot'))
    )
    try {
      if (cached) {
        const parsed = JSON.parse(cached) as { name?: string }
        names[address] = parsed.name
        return
      }
    } catch {}
    needToFetchAddresses.push(address)
  })
  await Promise.all(cachePromises)

  const identities = await api.query.identity.identityOf.multi(
    needToFetchAddresses
  )

  identities.forEach((identityCodec, i) => {
    const identity = identityCodec.toPrimitive() as any
    const name = identity?.info?.display?.raw
    const address = needToFetchAddresses[i]
    redisCallWrapper((redis) =>
      redis?.set(
        getIdentitiesRedisKey(address, 'polkadot'),
        JSON.stringify({ name }),
        'EX',
        MAX_AGE
      )
    )
    if (name) names[address] = name
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
