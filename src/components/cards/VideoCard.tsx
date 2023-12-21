import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import AddressAvatar from '../AddressAvatar'
import { useName } from '../Name'
type videoCardProps = {
  video?: any
  title?: string
  cover?: any
  channel?: any
  channelId?: any
  noteId?: any
  createdAt?: any
  hubId?: any
  videoId?: any
  creatorAddress?: any
}
export default function VideoCard({
  cover,
  channel,
  channelId,
  noteId,
  createdAt,
  title,
  hubId,
  videoId,
  creatorAddress,
}: videoCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const currentDate = new Date()
  const videoCreatedAt = new Date(createdAt)
  //@ts-ignore
  const diffInMilliseconds = currentDate - videoCreatedAt
  const diffInHours = diffInMilliseconds / (60 * 60 * 1000)
  const duration = moment.duration(diffInHours, 'hours')

  const { name } = useName(creatorAddress)
  return (
    <div
      className={` mx-auto flex shrink grow flex-col gap-2.5  overflow-hidden rounded-xl  px-2  xs:h-80 xs:w-11/12 sm:h-96 md:mb-1 md:h-[16.75rem] md:w-72 md:max-w-xs  md:px-0`}
    >
      <div className=''>
        <Link href={`/${hubId}/${videoId}`}>
          <div className=' cursor-pointer overflow-hidden rounded-xl border hover:border-indigo-600'>
            <Image
              src={`https://ipfs.subsocial.network/ipfs/${cover}`}
              alt='video cover'
              className='h-60 w-full rounded-xl object-cover hover:animate-scaleSlow sm:h-72 md:h-44 '
              width={200}
              height={200}
            />
          </div>
          <h2 className='my-1 line-clamp-2  text-sm leading-4 md:-mb-1 md:text-base'>
            {title}{' '}
          </h2>
        </Link>
      </div>

      <div className='flex items-center gap-3'>
        <AddressAvatar address={creatorAddress} className='-z-0' />

        <div>
          <h1 className='text-xs font-semibold md:text-sm '>{name}</h1>

          <p className='text-[9px]'>
            {' '}
            {duration.humanize().replace('a ', '')} ago
          </p>
        </div>
      </div>
    </div>
  )
}
