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

const ipfs = new SubsocialIpfsApi({
  ipfsNodeUrl: 'https://gw-seattle.cloud3.cc',
  ipfsClusterUrl: 'https://test-pin.cloud3.cc/psa/pins',
})
const authHeader = { authorization: `${getCrustIpfsAuth()}` }

ipfs.setWriteHeaders(authHeader)
ipfs.setPinHeaders(authHeader)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SaveFileResponse>
) {
  console.log(authHeader)
  if (req.method !== 'POST') return res.status(404).end()

  const body = req.body as IpfsPostContent

  console.log(body, body.body, typeof body)

  let cid: string
  try {
    cid = await ipfs.saveFile(JSON.stringify(body) as any)
    // await ipfs.pinContent(cid)
  } catch (e: any) {
    return res.status(500).send({
      success: false,
      errors: e.message,
    })
  }

  res.status(200).send({ success: true, cid: cid })
}
