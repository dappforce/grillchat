import { PINATA_APP_SECRET, PINATA_PROJECT_ID } from '@/assets/constant'
import { Buffer } from 'buffer'
import { create } from 'ipfs-http-client'
import { useState } from 'react'
PINATA_APP_SECRET
export const usePinToIpfs = () => {
  const [isUploading, setisUploading] = useState(false)
  const [isUploadingError, setisUploadingError] = useState(false)
  const [fileCID, setfileCID] = useState()

  const projectId = PINATA_PROJECT_ID
  const secret = PINATA_APP_SECRET
  console.log('the app id', secret)
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(
        `${projectId}:${secret}`,
        'utf-8'
      ).toString('base64')}`,
    },
  })

  const uploadToIpfs = async (file) => {
    try {
      setisUploading(true)
      const uploadedfile = await client.add(file)
      setisUploading(false)
      setfileCID(uploadedfile?.path)
      return uploadedfile
    } catch (error) {
      setisUploading(false)
      setisUploadingError(true)
    }
  }

  return {
    uploadToIpfs,
    isUploading,
    isUploadingError,
    fileCID,
    client,
  }
}
