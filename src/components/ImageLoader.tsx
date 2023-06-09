import { cx } from '@/utils/class-names'
import Image, { ImageProps } from 'next/image'
import { useLayoutEffect, useState } from 'react'

export type ImageLoaderProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
  image?: ImageProps['src']
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

export default function ImageLoader({
  image,
  containerClassName,
  loadingClassName,
  placeholderClassName,
  ...props
}: ImageLoaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  let usedImage = image
  if (typeof image === 'string') {
    usedImage = resolveIpfsUri(image, 'https://ipfs.subsocial.network/ipfs/')
  }

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
          key={usedImage?.toString() ?? ''}
          width={500}
          height={500}
          {...props}
          alt={props.alt || ''}
          src={usedImage ?? ''}
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
