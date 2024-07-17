import Button from '@/components/Button'
import ProfilePostsListModal from '@/components/chats/ChatItem/profilePosts/ProfileProstsListModal'
import Input from '@/components/inputs/Input'
import Toast from '@/components/Toast'
import { useProfilePostsModal } from '@/stores/profile-posts-modal'
import { cx, mutedTextColorStyles } from '@/utils/class-names'
import { isEthereumAddress } from '@polkadot/util-crypto'
import { useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import { toast } from 'sonner'

function getStartParam(urlOrAddress: string) {
  let result = ''

  try {
    let urlObj = new URL(urlOrAddress)

    let startParam = urlObj.searchParams.get('start')

    result = startParam || ''
  } catch {
    result = urlOrAddress
  }

  const isEth = isEthereumAddress(result)

  return {
    address: isEth ? result : undefined,
    error: !isEth ? 'Address is not valid' : undefined,
  }
}

const SearchUser = () => {
  const [value, setValue] = useState('')
  const { openModal } = useProfilePostsModal()

  return (
    <>
      <div className='flex flex-col gap-1 px-4'>
        <span className={cx(mutedTextColorStyles)}>Search user posts:</span>
        <div className='flex items-center gap-2 '>
          <Input
            placeholder='Eth address or referral link'
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />

          <Button
            variant='primary'
            size={'md'}
            roundings={'xl'}
            className='h-full'
            disabled={!value}
            onClick={() => {
              const { address, error } = getStartParam(value)

              if (error) {
                toast.custom((t) => <Toast t={t} title={error} />, {
                  duration: 5_000,
                })
              } else {
                openModal({ address })
              }
            }}
          >
            <IoSearchSharp />
          </Button>
        </div>
      </div>
      <ProfilePostsListModal tabsConfig={{ defaultTab: 'all' }} />
    </>
  )
}

export default SearchUser
