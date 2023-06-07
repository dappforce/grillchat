import { ComponentProps } from 'react'

export type NftImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  image: string
}

export default function NftImage({ image }: NftImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt='' />
  )
}
