import { Pluralize } from '@/components/Plularize'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceStruct } from '@subsocial/api/types'
import Link from 'next/link'

type Props = {
  space: SpaceStruct
}

export const SpaceStatsRow = ({ space }: Props) => {
  const { id, postsCount } = space
  const address = useMyMainAddress()

  const ownerId = space?.ownerId
  const isMyAddress = ownerId === address

  const statLinkCss = 'DfStatItem'

  return (
    <div className={'flex items-center gap-4'}>
      <Link href={`/${id}`} className='text-text-muted hover:text-text-primary'>
        <Pluralize count={postsCount || 0} singularText='Post' />
      </Link>

      {/* <div className={statLinkCss} style={{ cursor: 'pointer' }}>
        <Pluralize count={count} singularText='Follower' />
      </div> */}

      <Link
        href={`/${id}/about`}
        className='text-text-muted hover:text-text-primary'
      >
        About
      </Link>
    </div>
  )
}

export default SpaceStatsRow
