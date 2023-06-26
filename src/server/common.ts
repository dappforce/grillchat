import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type ApiResponse<T> = T & {
  success: boolean
  message: string
  errors?: any
}

export function handlerWrapper<Input extends z.ZodTypeAny>(config: {
  inputSchema: Input
  dataGetter: (req: NextApiRequest) => unknown
}) {
  return <Output>(handler: {
    handler: (
      data: z.infer<Input>,
      req: NextApiRequest,
      res: NextApiResponse<ApiResponse<Output>>
    ) => void
  }) => {
    return (req: NextApiRequest, res: NextApiResponse<ApiResponse<Output>>) => {
      const { dataGetter, inputSchema } = config
      const params = inputSchema.safeParse(dataGetter(req))

      if (!params.success) {
        return res.status(400).send({
          success: false,
          message: 'Invalid request body',
          errors: params.error.errors,
        } as ApiResponse<Output>)
      }

      return handler.handler(params.data, req, res)
    }
  }
}

export function getCommonErrorMessage(
  e: any,
  fallbackMsg = 'Error has been occurred'
) {
  return e ? { message: fallbackMsg, ...e }.message : fallbackMsg
}
