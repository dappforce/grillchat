import { cx } from '@/utils/class-names'
import { validateVideoUrl } from '@/utils/links'
import Image, { ImageProps } from 'next/image'
import { useLayoutEffect, useState } from 'react'
import Spinner from './Spinner'

export type MediaLoaderProps = Omit<ImageProps, 'src' | 'alt'> & {
  alt?: string
  image?: ImageProps['src']
  containerClassName?: string
  loadingClassName?: string
  placeholderClassName?: string
  withSpinner?: boolean
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

export default function MediaLoader({
  image,
  containerClassName,
  loadingClassName,
  placeholderClassName,
  withSpinner,
  ...props
}: MediaLoaderProps) {
  let [isLoading, setIsLoading] = useState(false)
  let usedImage = image
  if (typeof image === 'string') {
    usedImage = resolveIpfsUri(image, 'https://ipfs.subsocial.network/ipfs/')
  }

  useLayoutEffect(() => {
    setIsLoading(true)
  }, [image])

  const renderImageElement = () => {
    const commonClassName = cx(
      'relative transition-opacity',
      isLoading && 'opacity-0',
      props.className
    )

    const onLoad = (e: any) => {
      setIsLoading(false)
      props.onLoad?.(e)
    }

    const onError = (e: any) => {
      setIsLoading(false)
      props.onError?.(e)
    }

    const commonProps: any = {
      ...props,
      onLoad,
      onError,
      className: commonClassName,
      src: usedImage,
    }

    if (typeof usedImage === 'string' && validateVideoUrl(usedImage)) {
      return (
        <video
          {...commonProps}
          onLoadedData={onLoad}
          className={cx(commonClassName, 'aspect-square')}
          controls
          autoPlay
        />
      )
    } else if (typeof usedImage === 'string' && usedImage.startsWith('data:')) {
      // width and height props will make iframe not square in clickable media
      const { width, height, ...iframeProps } = commonProps
      return (
        <>
          <iframe
            {...iframeProps}
            className={cx(commonClassName, 'aspect-square')}
          />
          <div
            {...iframeProps}
            className='absolute inset-0 z-10 h-full w-full opacity-0'
          />
        </>
      )
    } else {
      return (
        <Image
          key={usedImage?.toString() ?? ''}
          {...commonProps}
          width={commonProps.width || 500}
          height={commonProps.height || 500}
          alt={props.alt || ''}
        />
      )
    }
  }

  const imageElement = renderImageElement()

  return (
    <div className={cx('relative', containerClassName)}>
      {isLoading && (
        <div
          className={cx(
            'absolute inset-0 flex h-full w-full animate-pulse items-center justify-center bg-black/20',
            loadingClassName
          )}
        >
          {withSpinner && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Spinner className='h-8 w-8 text-text-primary' />
            </div>
          )}
        </div>
      )}
      {image ? (
        imageElement
      ) : (
        <div className={cx('aspect-square w-full', placeholderClassName)} />
      )}
    </div>
  )
}
