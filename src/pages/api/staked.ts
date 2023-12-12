import { ApiResponse, handlerWrapper } from '@/server/common'
import { getSubIdRequest } from '@/server/external'
import { BN } from 'bn.js'

import { z } from 'zod'

const querySchema = z.object({
  address: z.string(),
})

export type ApiStakedParams = z.infer<typeof querySchema>

type ResponseData = { data?: boolean }
export type ApiStakedResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  dataGetter: (req) => req.query,
  inputSchema: querySchema,
})<ResponseData>({
  allowedMethods: ['GET'],
  errorLabel: 'staked',
  handler: async (data, _, res) => {
    if (!data.address) {
      return res
        .status(400)
        .json({ message: 'Address not provided', success: false })
    }

    const subIdApi = getSubIdRequest()
    const response = await subIdApi.get(
      `/staking/creator/backer/ledger?account=${data.address}`
    )
    const stakingData = response.data as { totalLocked: string }
    const isStaked = new BN(stakingData.totalLocked).isZero()

    return res.json({
      message: 'OK',
      success: true,
      data: isStaked,
    })
  },
})
