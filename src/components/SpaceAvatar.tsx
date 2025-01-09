import { SpaceData } from '@subsocial/api/types'
import Image from 'next/image'
import AddressAvatar from './AddressAvatar'

type SpaceAvatarProps = {
  space: SpaceData
  imageSize?: number
}

const SpaceAvatar = ({ space, imageSize = 48 }: SpaceAvatarProps) => {
  const image = space.content?.image

  return (
    <div>
      {image ? (
        <Image
          src={image}
          alt='Space avatar'
          width={imageSize}
          height={imageSize}
          className='rounded-full'
        />
      ) : (
        <AddressAvatar address={space.struct.ownerId} />
      )}
    </div>
  )
}

export default SpaceAvatar
