import { ComponentProps } from 'react'

export type NftImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  image: string
}

function resolveIpfsUri(uri: string | undefined, gatewayUrl: string) {
  if (!uri) {
    return undefined
  }
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', gatewayUrl)
  }
  return uri
}

export default function NftImage({ image, ...props }: NftImageProps) {
  const imageUrl = resolveIpfsUri(image, 'https://ipfs.subsocial.network/ipfs/')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={imageUrl} alt='' />
  )
}
