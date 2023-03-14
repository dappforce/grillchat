import { CRUST_IPFS_CONFIG } from '@/subsocial-query/subsocial/config'
import { getCrustIpfsAuth } from '@/utils/env/server'
import { SubsocialIpfsApi } from '@subsocial/api'
import { IpfsPostContent } from '@subsocial/api/types'
import { NextApiRequest, NextApiResponse } from 'next'

export type SaveFileRequest = IpfsPostContent

export type SaveFileResponse = {
  success: boolean
  errors?: any
  cid?: string
}

const headers = { authorization: `${getCrustIpfsAuth()}` }

const ipfs = new SubsocialIpfsApi({
  ...CRUST_IPFS_CONFIG,
  headers,
})
ipfs.setWriteHeaders(headers)
ipfs.setPinHeaders(headers)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveFileResponse>
) {
  if (req.method !== 'POST') return res.status(404).end()

  const body = req.body as IpfsPostContent

  let cid: string
  try {
    cid = await ipfs.saveFile(JSON.stringify(body))
    await ipfs.pinContent(cid, { 'meta.gatewayId': 1 })
  } catch (e: any) {
    return res.status(500).send({
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, cid: cid })
}
