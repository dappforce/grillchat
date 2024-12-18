import ImageAdd from '@/assets/icons/image-add.svg'
import {
  COMPRESSED_IMAGE_MAX_SIZE,
  SOURCE_IMAGE_MAX_SIZE,
} from '@/constants/image'
import { useSaveImage } from '@/services/api/mutation'
import { cx } from '@/utils/class-names'
import { resizeImage } from '@/utils/image'
import React, { ComponentProps, useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { HiTrash } from 'react-icons/hi2'
import Button from '../Button'
import InfoPanel from '../InfoPanel'
import MediaLoader from '../MediaLoader'
import Spinner from '../Spinner'

export const SUPPORTED_IMAGE_EXTENSIONS = [
  '.png',
  '.gif',
  '.jpeg',
  '.jpg',
  '.svg',
]

export type ImageInputProps = ComponentProps<'input'> & {
  image: string
  setImageUrl: (url: string) => void
  error?: string | true
  containerProps?: ComponentProps<'div'>
  withIpfsPrefix?: boolean
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ImageInput({
  image,
  setImageUrl,
  containerProps,
  withIpfsPrefix,
  error,
  disabled,
  setIsLoading,
  ...props
}: ImageInputProps) {
  const { mutate: saveImage, isError, isLoading, data, reset } = useSaveImage()
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (setIsLoading) setIsLoading(isLoading)
  }, [setIsLoading, isLoading])

  const onImageChosen = async (files: File[]) => {
    const image = files[0] ?? null
    if (image.size > SOURCE_IMAGE_MAX_SIZE) {
      setErrorMsg(
        `Your image is too big. Try to upload smaller version less than ${
          SOURCE_IMAGE_MAX_SIZE / 1024 / 1024
        } MB`
      )
      return
    }
    const resizedImage = await resizeImage(image)
    if (resizedImage.size > COMPRESSED_IMAGE_MAX_SIZE) {
      setErrorMsg('Your image is too big. Try to upload smaller version')
      return
    }
    saveImage(resizedImage)
  }

  const shownImage =
    image || (withIpfsPrefix ? `ipfs://${data?.cid}` : data?.cid)

  return (
    <div
      {...containerProps}
      className={cx(
        'relative flex flex-col items-center gap-2',
        containerProps?.className
      )}
    >
      <Dropzone
        multiple={false}
        accept={{ 'image/*': SUPPORTED_IMAGE_EXTENSIONS }}
        onDrop={onImageChosen}
        disabled={disabled}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className={cx(
              'flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-full border border-dashed border-text-muted p-4 text-center transition-colors md:h-24 md:w-24',
              'hover:border-text-primary hover:text-text-primary focus-visible:border-text-primary focus-visible:text-text-primary',
              isError && 'border-text-red'
            )}
          >
            <input {...props} {...getInputProps()} />
            <div className='text-3xl'>
              {isLoading ? <Spinner className='block h-8 w-8' /> : <ImageAdd />}
            </div>
          </div>
        )}
      </Dropzone>
      {(error || isError || errorMsg) && (
        <InfoPanel>
          {errorMsg || error || '😥 Sorry, we cannot upload your image.'}
        </InfoPanel>
      )}
      {shownImage && (
        <div className='absolute inset-0 h-20 w-20 md:h-24 md:w-24'>
          <MediaLoader
            containerClassName='h-full w-full rounded-full overflow-hidden'
            className='h-full w-full object-cover'
            src={shownImage}
            onLoad={() => {
              if (shownImage) setImageUrl(shownImage)
            }}
            imageOnly
          />
          <Button
            disabled={disabled}
            className='absolute right-0 top-0 bg-background-lighter text-text-red'
            size='circle'
            onClick={() => {
              setImageUrl('')
              reset()
            }}
          >
            <HiTrash />
          </Button>
        </div>
      )}
    </div>
  )
}
