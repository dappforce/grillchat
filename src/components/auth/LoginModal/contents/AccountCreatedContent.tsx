import Button from '@/components/Button'
import ProfilePreview from '@/components/ProfilePreview'
import { useMyMainAddress } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LoginModalContentProps } from '../LoginModalContent'

export const AccountCreatedContent = ({
  setCurrentState,
}: LoginModalContentProps) => {
  const myAddress = useMyMainAddress()

  return (
    <div className='flex flex-col'>
      {myAddress && (
        <div
          className={cx(
            'mb-6 mt-2 flex flex-col rounded-2xl bg-background-lighter p-4'
          )}
        >
          <ProfilePreview
            address={myAddress}
            avatarClassName={cx('h-16 w-16')}
          />
        </div>
      )}
      <Button size='lg' onClick={() => setCurrentState('next-actions')}>
        Continue
      </Button>
    </div>
  )
}
