import UploadPage from '@/components/uploadPage/UploadPage'
import { NextSeo } from 'next-seo'

export default function upload() {
  return (
    <>
      <NextSeo
        title='upload'
        description='upload to decentralized video sharing platform '
      />
      <UploadPage />
    </>
  )
}
