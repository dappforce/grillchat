import { motion } from 'framer-motion'
import moment from 'moment'
import Link from 'next/link'
import { useState } from 'react'
type videoCardProps = {
  video?: any
  title?: string
  cover?: any
  channel?: any
  channelId?: any
  noteId?: any
  createdAt?: any
}
export default function VideoCard({
  cover,
  channel,
  channelId,
  noteId,
  createdAt,
  title,
}: videoCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const currentDate = new Date()
  const videoCreatedAt = new Date(createdAt)
  //@ts-ignore
  const diffInMilliseconds = currentDate - videoCreatedAt
  const diffInHours = diffInMilliseconds / (60 * 60 * 1000)
  const duration = moment.duration(diffInHours, 'hours')
  return (
    <div
      className={` mx-auto flex max-w-sm shrink grow flex-col  gap-2.5 overflow-hidden  rounded-xl  px-2 xs:h-80 xs:w-11/12 sm:h-96 md:mb-1 md:h-[16.75rem] md:w-64  md:px-0`}
    >
      <div className='hover:text-rose-400/90'>
        <Link href={`/watch/${channelId}-${noteId}`}>
          <div className=' cursor-pointer overflow-hidden rounded-xl border-rose-500 hover:border'>
            <motion.img
              src={`https://ipfs.subsocial.network/ipfs/${cover}`}
              alt='video cover'
              className='h-60 w-full rounded-xl object-cover sm:h-72 md:h-44 '
              whileHover={{
                scale: 1.09,
                transition: {
                  duration: 0.5,
                },
              }}
            ></motion.img>
          </div>
          <h2 className='my-1 line-clamp-2  text-sm leading-4 md:-mb-1 md:text-base'>
            {title}{' '}
          </h2>
        </Link>
      </div>

      <div className='flex items-center gap-3'>
        <div className='h-6 w-6 rounded-full border border-yellow-700'></div>

        <div>
          <Link href={`/c/${channelId}`}>
            <h1 className='text-xs font-semibold md:text-sm '>kabugu</h1>
          </Link>

          <p className='text-[9px]'>
            {' '}
            {duration.humanize().replace('a ', '')} ago
          </p>
        </div>
      </div>
    </div>
  )
}
