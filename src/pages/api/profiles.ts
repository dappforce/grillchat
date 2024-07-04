import { redisCallWrapper } from '@/server/cache'
import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  SubsocialProfile,
  getProfiles,
} from '@/services/datahub/profiles/fetcher'
import { parseJSONData } from '@/utils/strings'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const querySchema = z.object({
  addresses: z.array(z.string()).or(z.string()),
})
export type ApiProfilesParams = z.infer<typeof querySchema>

const bodySchema = z.object({
  address: z.string(),
})
export type ApiProfilesInvalidationBody = z.infer<typeof bodySchema>

type ResponseData = {
  data?: SubsocialProfile[]
}
export type ApiProfilesResponse = ApiResponse<ResponseData>
export type ApiProfilesInvalidationResponse = ApiResponse<{}>

const INVALIDATED_MAX_AGE = 1 * 60 // 1 minute
const getInvalidatedProfileRedisKey = (id: string) => {
  return `profiles-invalidated:${id}`
}

const GET_handler = handlerWrapper({
  inputSchema: querySchema,
  dataGetter: (req: NextApiRequest) => req.query,
})<ResponseData>({
  errorLabel: 'profiles',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const addresses = Array.isArray(data.addresses)
      ? data.addresses
      : [data.addresses]
    const profiles = await getProfilesServer(addresses)
    return res
      .status(200)
      .send({ success: true, message: 'OK', data: profiles })
  },
})

const POST_handler = handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req: NextApiRequest) => req.body,
})<{}>({
  errorLabel: 'posts',
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    redisCallWrapper(async (redis) => {
      return redis?.set(
        getInvalidatedProfileRedisKey(data.address),
        data.address,
        'EX',
        INVALIDATED_MAX_AGE
      )
    })

    return res.status(200).send({ success: true, message: 'OK' })
  },
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  } else if (req.method === 'POST') {
    return POST_handler(req, res)
  }
}

const PROFILE_MAX_AGE = 5 * 60 // 5 minutes
const getProfileRedisKey = (id: string) => {
  return `profiles:${id}`
}
export async function getProfilesServer(
  addresses: string[]
): Promise<SubsocialProfile[]> {
  if (addresses.length === 0) return []

  const profiles: SubsocialProfile[] = []
  const needToFetch: string[] = []
  const promises = addresses.map(async (address) => {
    redisCallWrapper(async (redis) => {
      const [profile, isInvalidated] = await Promise.all([
        redis?.get(getProfileRedisKey(address)),
        redis?.get(getInvalidatedProfileRedisKey(address)),
      ] as const)
      const parsed =
        profile && parseJSONData<{ data: SubsocialProfile | null }>(profile)
      if (parsed && !isInvalidated) {
        if (parsed.data) profiles.push(parsed.data)
        // if null, we don't need to fetch it
      } else {
        needToFetch.push(address)
      }
    })
  })
  await Promise.allSettled(promises)

  const fetchedProfiles = await getProfiles(needToFetch)
  const profilesMap = new Map<string, SubsocialProfile>()
  fetchedProfiles.forEach(async (profile) => {
    profilesMap.set(profile.address, profile)
  })

  needToFetch.map((address) => {
    const profile = profilesMap.get(address) ?? null
    redisCallWrapper(async (redis) => {
      await redis?.set(
        getProfileRedisKey(address),
        JSON.stringify({ data: profile }),
        'EX',
        PROFILE_MAX_AGE
      )
    })
  })

  return [...profiles, ...fetchedProfiles]
}
