import {
  useFollowSpace,
  useUnFollowSpace,
} from '@/services/datahub/spaces/mutation'
import { getSpaceIdsByFollower } from '@/services/datahub/spaces/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyMainAddress } from '@/stores/my-account'
import { useQueryClient } from '@tanstack/react-query'
import Button, { ButtonProps } from './Button'

type FollowUnfollowSpaceButtonProps = Omit<
  ButtonProps,
  'variant' | 'onClick'
> & {
  spaceId: string
}

const FollowUnfollowSpaceButton = ({
  spaceId,
  ...props
}: FollowUnfollowSpaceButtonProps) => {
  const myAddress = useMyMainAddress()
  const client = useQueryClient()
  const { setIsOpen } = useLoginModal()
  const { data } = getSpaceIdsByFollower.useQuery(myAddress || '')
  const { mutateAsync: followSpace } = useFollowSpace({
    onSuccess: () => {
      getSpaceIdsByFollower.fetchQuery(client, myAddress || '')
    },
  })
  const { mutateAsync: unfollowSpace } = useUnFollowSpace({
    onSuccess: () => {
      getSpaceIdsByFollower.fetchQuery(client, myAddress || '')
    },
  })

  const isFollowing = data?.includes(spaceId)

  const onFollowClick = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!myAddress) {
      setIsOpen(true)
      return
    }

    if (isFollowing) {
      await unfollowSpace({
        spaceId,
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
      })
    } else {
      await followSpace({
        spaceId,
        timestamp: Date.now(),
        uuid: crypto.randomUUID(),
      })
    }
  }

  return (
    <Button
      {...props}
      variant={isFollowing ? 'primaryOutline' : 'primary'}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        onFollowClick(e)
      }}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}

export default FollowUnfollowSpaceButton
