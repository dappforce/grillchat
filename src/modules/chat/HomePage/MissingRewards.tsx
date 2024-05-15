import Button from '@/components/Button'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyGrillAddress, useMyMainAddress } from '@/stores/my-account'
import { IoWarning } from 'react-icons/io5'
import { SiEthereum } from 'react-icons/si'

type MissingRewardsProps = {
  address?: string
}

const MissingRewards = ({ address }: MissingRewardsProps) => {
  const setModalOpen = useLoginModal.use.setIsOpen()
  const setDefaultModalState = useLoginModal.use.setDefaultOpenState()
  const myGrillAddress = useMyGrillAddress()
  const myAddress = useMyMainAddress()
  const { data: linkedIdentity } = getLinkedIdentityQuery.useQuery(
    myGrillAddress ?? ''
  )
  const isNotLinkedEvm = !linkedIdentity?.externalProviders.find(
    (identity) => identity.provider === IdentityProvider.Evm
  )?.externalId

  if (!isNotLinkedEvm || (myAddress && address !== myAddress)) return null

  return (
    <div className='flex flex-col gap-4 rounded-2xl border border-[#FDE047] bg-[#FEFCE8] p-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-base font-semibold leading-6 text-[#412006]'>
            Missing Out on Rewards!
          </span>
          <IoWarning className='h-6 w-6 [&>path]:fill-orange-400' />
        </div>
        <span className='text-sm font-normal leading-[22px] text-[#854D0F]'>
          You&apos;re earning rewards but can&apos;t manage them yet. Connect
          your EVM now to access and control your earnings.
        </span>
      </div>
      <Button
        variant='transparent'
        className='flex w-fit items-center gap-1 border border-[#EBB305] !px-[14px] !py-2 text-[#854D0F]'
        onClick={() => {
          setDefaultModalState('evm-address-link')
          setModalOpen(true)
        }}
      >
        <SiEthereum className='h-[16.5px] w-[16.5px] [&>path]:fill-[#A16207]' />{' '}
        Connect wallet
      </Button>
    </div>
  )
}

export default MissingRewards
