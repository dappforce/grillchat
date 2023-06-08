import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useLayoutEffect, useState } from 'react'

export type NftImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
  image?: string
  containerClassName?: string
  loadingClassName?: string
  placeholderClassName?: string
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
  loadingClassName,
  placeholderClassName,
  ...props
}: NftImageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const imageUrl = resolveIpfsUri(image, 'https://ipfs.subsocial.network/ipfs/')

  useLayoutEffect(() => {
    setIsLoading(true)
  }, [image])

  return (
    <div className={cx('relative', containerClassName)}>
      {isLoading && (
        <div
          className={cx(
            'absolute inset-0 h-full w-full animate-pulse bg-background-lighter',
            loadingClassName
          )}
        />
      )}
      {image ? (
        <Image
          key={image}
          {...props}
          width={500}
          height={500}
          alt={props.alt || ''}
          src={imageUrl ?? ''}
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
      ) : (
        <div className={cx('aspect-square w-full', placeholderClassName)} />
      )}
    </div>
  )
}
