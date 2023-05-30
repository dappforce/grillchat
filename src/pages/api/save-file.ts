import { getIpfsApi } from '@/utils/server'
import { IpfsPostContent } from '@subsocial/api/types'
import { NextApiRequest, NextApiResponse } from 'next'

export type SaveFileRequest = IpfsPostContent

export type SaveFileResponse = {
  success: boolean
  errors?: any
  cid?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveFileResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = req.body as IpfsPostContent
  const { saveAndPinJson } = getIpfsApi()

  let cid: string
  try {
    cid = await saveAndPinJson(body)
  } catch (e: any) {
    return res.status(500).send({
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, cid: cid })
}
