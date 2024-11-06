import { ApiResponse, handlerWrapper } from '@/server/common'
import {
  addExternalProviderToIdentity,
  getLinkIdentityMessage,
  linkIdentity,
  updateExternalProvider,
} from '@/server/datahub-queue/identity'
import { datahubMutationWrapper } from '@/server/datahub-queue/utils'
import {
  IdentityProvider,
  SocialEventDataApiInput,
} from '@subsocial/data-hub-sdk'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { auth } from '../auth/[...nextauth]'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  }
  if (req.method === 'POST') {
    return POST_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

const inputSchema = z.object({
  id: z.string(),
  provider: z.string(),
  payload: z.any(),
})

export type ApiDatahubIdentityBody = {
  id: string
  provider: IdentityProvider
  payload: SocialEventDataApiInput
}
export type ApiDatahubModerationResponse = ApiResponse
const POST_handler = handlerWrapper({
  inputSchema,
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'identity-action',
  handler: async (data, req, res) => {
    const { id, payload, provider } = data as ApiDatahubIdentityBody

    if (
      provider === IdentityProvider.TWITTER ||
      provider === IdentityProvider.GOOGLE
    ) {
      const authObj = await auth(req, res)
      const user = authObj?.user
      if (!user || (user.id !== id && user.email !== id)) {
        res.status(403).json({ message: 'Unauthorized', success: false })
        return
      }
    }

    const mapper = datahubMutationWrapper(datahubIdentityActionMapping)
    await mapper(payload)

    res.json({
      message: 'OK',
      success: true,
    })
  },
})

async function datahubIdentityActionMapping(data: SocialEventDataApiInput) {
  const callName = data.callData?.name
  if (callName === 'synth_init_linked_identity') {
    await linkIdentity(data)
  } else if (callName === 'synth_add_linked_identity_external_provider') {
    await addExternalProviderToIdentity(data)
  } else if (callName === 'synth_update_linked_identity_external_provider') {
    await updateExternalProvider(data)
  } else {
    throw Error('Unknown identity action')
  }
}

const GET_handler = handlerWrapper({
  inputSchema: z.object({ address: z.string() }),
  dataGetter: (req) => req.query,
})<{ data: string }>({
  allowedMethods: ['GET'],
  errorLabel: 'identity-query',
  handler: async (data, req, res) => {
    const message = await getLinkIdentityMessage(data.address)
    res.json({ success: true, message: 'OK', data: message })
  },
})
