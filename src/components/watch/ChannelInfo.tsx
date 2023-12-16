import { useAccountCharacter, useFollowCharacter } from '@crossbell/connect-kit'
import {
  useCharacterFollowRelation,
  useCharacterFollowStats,
} from '@crossbell/indexer'
import { CharacterAvatar } from '@crossbell/ui'
import { useRouter } from 'next/router'
import { useState } from 'react'

type channelProps = {
  channel?: any
}
export default function ChannelInfo({ channel }: channelProps) {
  const { data: profileStats } = useCharacterFollowStats(channel?.characterId)
  const [testTruth, settestTruth] = useState(true)
  const currentCharacter = useAccountCharacter()
  const router = useRouter()
  const follow = useFollowCharacter()
  const { data: relationStatus } = useCharacterFollowRelation(
    currentCharacter?.characterId,
    channel?.characterId
  )
  console.log('the follow  stats', relationStatus)
  console.log('the channel  stats', channel)
  return (
    <div className='my-3 flex items-center justify-between'>
      <div className='flex items-center gap-2'>
        <div className='h-10 w-10 rounded-full shadow-2xl sm:h-14 sm:w-14 lg:h-20 lg:w-20 '>
          <CharacterAvatar size={`full`} character={channel} />
        </div>
        <div>
          <h1 className='text-muted text-sm font-semibold hover:text-rose-600 md:text-lg md:font-normal'>
            {channel?.handle}
          </h1>
          <p className='text-xs md:text-sm'>
            {profileStats?.followersCount} Followers
          </p>
        </div>
      </div>
      <>
        {relationStatus?.isFollowing ? (
          <div className='flex cursor-pointer items-center gap-3 rounded-xl bg-rose-300 px-4 py-2 text-white'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='h-6 w-6 text-red-600'
            >
              <path d='M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z' />
            </svg>

            <p className='text-sm md:text-lg'>Following</p>
          </div>
        ) : (
          <div
            className='flex cursor-pointer items-center gap-3 rounded-xl bg-rose-500 px-4 py-2 text-white'
            onClick={() => follow.mutate(channel?.characterId)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1.5}
              stroke='currentColor'
              className='h-4 w-4 md:h-5 md:w-5'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
              />
            </svg>

            <p className='text-sm md:text-lg'>Follow</p>
          </div>
        )}
      </>
    </div>
  )
}
