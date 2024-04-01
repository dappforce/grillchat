import { handlerWrapper } from '@/server/common'
import {
  Proposal,
  SubsquareProposal,
  mapSubsquareProposalToProposal,
} from '@/server/opengov/mapper'
import { subsquareApi } from '@/server/opengov/utils'
import { z } from 'zod'

const handler = handlerWrapper({
  inputSchema: z.object({
    id: z.number().int().positive(),
  }),
  dataGetter: (req) => req.query,
})<ApiProposalsResponse>({
  errorLabel: 'proposal-detail',
  allowedMethods: ['GET'],
  handler: async (data, _, res) => {
    const response = await getProposalDetailServer(data)
    res.json({ ...response, message: 'OK', success: true })
  },
})
export default handler

export type ApiProposalsResponse = { data: Proposal }

// TODO: add redis cache
export async function getProposalDetailServer({
  id,
}: {
  id: number
}): Promise<ApiProposalsResponse> {
  const res = await subsquareApi.get(`/gov2/referendums/${id}`)
  const proposal = res.data as SubsquareProposal

  return {
    data: mapSubsquareProposalToProposal(proposal),
  }
}
