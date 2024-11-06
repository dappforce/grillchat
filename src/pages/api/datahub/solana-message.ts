import { handlerWrapper } from '@/old/server/common'
import { datahubQueueRequest } from '@/server/datahub-queue/utils'
import { gql } from 'graphql-request'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const LINK_IDENTITY_SOLANA_MESSAGE = gql`
  mutation LinkIdentitySolanaMessage($address: String!) {
    linkedIdentityExternalProviderSolanaProofMsg(address: $address) {
      message
    }
  }
`
async function getLinkIdentitySolanaMessage(address: string) {
  const res = await datahubQueueRequest<
    { linkedIdentityExternalProviderSolanaProofMsg: { message: string } },
    { address: string }
  >({
    document: LINK_IDENTITY_SOLANA_MESSAGE,
    variables: {
      address,
    },
  })
  return res?.linkedIdentityExternalProviderSolanaProofMsg?.message
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return GET_handler(req, res)
  }

  return res.status(405).send('Method Not Allowed')
}

const GET_handler = handlerWrapper({
  inputSchema: z.any(),
  dataGetter: (req) => req.query,
})<{ message: string }>({
  allowedMethods: ['GET'],
  errorLabel: 'referral',
  handler: async (data, _, res) => {
    const message = await getLinkIdentitySolanaMessage(data.address)
    res.json({
      message,
      success: true,
    })
  },
})
