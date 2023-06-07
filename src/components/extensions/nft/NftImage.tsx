import { ImageProps } from 'next/image'

export type NftImageProps = ImageProps & {
  image: string
}

export default function NftPreview({ image }: NftImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt='' />
  )
}
