import { env } from '@/env.mjs'
import { ApiResponse, handlerWrapper } from '@/server/common'
import { getLinkedIdentity } from '@/services/datahub/identity/fetcher'
import { verifyMessage } from 'ethers'
import request, { gql } from 'graphql-request'
import { z } from 'zod'

const inputSchema = z.object({
  id: z.string(),
  sig: z.string(),
  sessionAddress: z.string(),
})

export type ApiDatahubRemoveIdentityBody = z.infer<typeof inputSchema>
export type ApiDatahubRemoveIdentityResponse = ApiResponse
export default handlerWrapper({
  inputSchema,
  dataGetter: (req) => req.body,
})({
  allowedMethods: ['POST'],
  errorLabel: 'remove-identity',
  handler: async (data, _, res) => {
    const sessionAddress = verifyMessage(data.id, data.sig)
    if (sessionAddress !== data.sessionAddress) {
      res.status(403).json({ message: 'Unauthorized', success: false })
      return
    }

    const linkedIdentity = await getLinkedIdentity({ sessionAddress })
    if (!linkedIdentity || linkedIdentity.mainAddress !== data.id) {
      res.status(403).json({ message: 'Unauthorized', success: false })
      return
    }

    await request<
      { removedSessionsCount: number },
      { linkedIdentityId: string }
    >(
      env.NEXT_PUBLIC_DATAHUB_QUERY_URL,
      gql`
        mutation RemoveLinkedIdentity($linkedIdentityId: String!) {
          linkedIdentityTerminateLinkedIdentitySession(
            linkedIdentityId: $linkedIdentityId
          ) {
            removedSessionsCount
            removedExternalProvidersCount
          }
        }
      `,
      { linkedIdentityId: data.id },
      { Authorization: `Bearer ${env.DATAHUB_QUEUE_TOKEN}` }
    )

    res.json({
      message: 'OK',
      success: true,
    })
  },
})
