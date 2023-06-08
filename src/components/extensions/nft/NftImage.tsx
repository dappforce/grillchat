import { cx } from '@/utils/class-names'
import { ComponentProps, useLayoutEffect, useState } from 'react'

export type NftImageProps = Omit<ComponentProps<'img'>, 'src'> & {
  image: string
  containerClassName?: string
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

export default function NftImage({
  image,
  containerClassName,
  ...props
}: NftImageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const imageUrl = resolveIpfsUri(image, 'https://ipfs.subsocial.network/ipfs/')

  useLayoutEffect(() => {
    setIsLoading(true)
  }, [image])

  if (!image) return null

  return (
    <div className={cx('relative', containerClassName)}>
      {isLoading && (
        <div className='absolute inset-0 h-full w-full animate-pulse rounded-2xl bg-background-lighter' />
      )}
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=''
          key={image}
          {...props}
          src={imageUrl}
          loading='lazy'
          className={cx(
            'relative transition-opacity',
            isLoading && 'opacity-0',
            props.className
          )}
          onLoad={(e) => {
            setIsLoading(false)
            props.onLoad?.(e)
          }}
        />
      )}
    </div>
  )
}
