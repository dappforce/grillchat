import { ApiResponse, handlerWrapper } from '@/server/common'
import { getIpfsApi } from '@/server/ipfs'
import { z } from 'zod'

const bodySchema = z.any()
export type SaveFileRequest = z.infer<typeof bodySchema>

type ResponseData = {
  cid?: string
}
export type SaveFileResponse = ApiResponse<ResponseData>

export default handlerWrapper({
  inputSchema: bodySchema,
  dataGetter: (req) => req.body,
})<ResponseData>({
  allowedMethods: ['POST'],
  handler: async (data, _, res) => {
    const { saveAndPinJson } = getIpfsApi()

    let cid: string
    try {
      cid = await saveAndPinJson(data)
    } catch (e: any) {
      return res.status(500).send({
        message: 'Failed to save file',
        success: false,
        errors: e.message,
      })
    }

    res.status(200).send({ message: 'OK', success: true, cid: cid })
  },
})
