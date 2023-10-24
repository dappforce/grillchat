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
  const [polkadotIdentities] = await Promise.all([
    getPolkadotIdentities(addresses),
    // TODO: KILT IDENTITIES
    // getKiltIdentities(addresses),
  ] as const)

  return addresses.map((address) => ({
    address,
    polkadot: polkadotIdentities[address],
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
  const api = await getKiltApi()
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
    if (name) w3names[address] = name
  })

  return w3names
}
