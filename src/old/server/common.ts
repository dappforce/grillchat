import { env } from '@/env.mjs'
import { Keyring } from '@polkadot/keyring'
import { waitReady } from '@polkadot/wasm-crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

export type ApiResponse<T = {}> = T & {
  success: boolean
  message: string
  errors?: any
}

export function handlerWrapper<Input extends z.ZodTypeAny>(config: {
  inputSchema: Input | null
  dataGetter: (req: NextApiRequest) => unknown
}) {
  return <Output>(handlerConfig: {
    errorLabel: string
    handler: (
      data: z.infer<Input>,
      req: NextApiRequest,
      res: NextApiResponse<ApiResponse<Output>>
    ) => PromiseLike<void>
    allowedMethods?: ('GET' | 'POST' | 'PUT' | 'DELETE')[]
  }) => {
    return async (
      req: NextApiRequest,
      res: NextApiResponse<ApiResponse<Output>>
    ) => {
      const { handler, allowedMethods, errorLabel } = handlerConfig

      if (!allowedMethods?.includes(req.method ?? ('' as any)))
        return res.status(404).end()

      const { dataGetter, inputSchema } = config
      if (!inputSchema) {
        try {
          return await handler(null, req, res)
        } catch (err) {
          console.error(`Error in ${errorLabel || 'handler'}:`, err)
          return res.status(500).send({
            success: false,
            message: 'Internal server error',
            errors: err,
          } as ApiResponse<Output>)
        }
      }

      const params = inputSchema.safeParse(dataGetter(req))

      if (!params.success) {
        return res.status(400).send({
          success: false,
          message: 'Invalid request body',
          errors: params.error.errors,
        } as ApiResponse<Output>)
      }

      try {
        return await handler(params.data, req, res)
      } catch (err) {
        console.error(`Error in ${errorLabel} method: ${req.method}:`, err)
        return res.status(500).send({
          success: false,
          message: 'Internal server error',
          errors: err,
        } as ApiResponse<Output>)
      }
    }
  }
}

export function getCommonErrorMessage(
  e: any,
  fallbackMsg = 'Error has been occurred'
) {
  return e ? { message: fallbackMsg, ...e }.message : fallbackMsg
}

export function convertNonce(nonce: number) {
  const newNonce = new Uint8Array(24)

  newNonce[0] = nonce

  return newNonce
}

export async function getServerAccount() {
  const mnemonic = env.SERVER_MNEMONIC
  const keyring = new Keyring()
  await waitReady()
  return keyring.addFromMnemonic(mnemonic, {}, 'sr25519')
}
