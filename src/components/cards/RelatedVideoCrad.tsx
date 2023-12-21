//@ts-nocheck
import { IPFS_GATEWAY2 } from '@/assets/constant'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
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
export default function RelatedVideoCrad({
  video,
  title,
  cover,
  channel,
  channelId,
  noteId,
  createdAt,
  hubId,
  videoId,
  creatorAddress,
}: videoCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const currentDate = new Date()
  const videoCreatedAt = new Date(createdAt)
  const diffInMilliseconds = currentDate - videoCreatedAt
  const diffInHours = diffInMilliseconds / (60 * 60 * 1000)
  const duration = moment.duration(diffInHours, 'hours')
  const { name, ensNames } = useName(creatorAddress)
  return (
    <div className='w-full'>
      <div className='flex  gap-2 '>
        <div className='600 h-24 w-44  overflow-hidden rounded-xl hover:border-rose-400 '>
          <Link href={`/${hubId}/${videoId}`}>
            <Image
              src={`${IPFS_GATEWAY2}${cover}`}
              width={300}
              height={300}
              alt='cover'
              className='h-full w-full rounded-xl object-cover hover:animate-scaleSlow'
            />
          </Link>
        </div>
        <div className='w-44 flex-1 '>
          <Link href={`${channelId}-${noteId}`}>
            <h1 className='mb-3  line-clamp-2 text-sm font-light '>{title}</h1>
          </Link>
          <Link href={`/c/${channelId}`}>
            <h2 className='line-clamp-1 text-xs'>{name}</h2>
          </Link>
          <p className='text-xs font-light'>
            {duration.humanize().replace('a ', '')} ago
          </p>
        </div>
      </div>
    </div>
  )
}
