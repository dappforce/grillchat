import Button from '@/components/Button'
import { getIsBalanceSufficientQuery } from '@/services/datahub/balances/query'
import { IdentityProvider } from '@/services/datahub/generated-query'
import { getLinkedIdentityQuery } from '@/services/datahub/identity/query'
import { useLoginModal } from '@/stores/login-modal'
import { useMyGrillAddress, useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { IoWarning } from 'react-icons/io5'
import { SiEthereum } from 'react-icons/si'

type WarningType = 'missing-rewards' | 'no-points'

const warningPropsByType: Record<
  WarningType,
  {
    title: string
    description: string
    buttonText: React.ReactNode
  }
> = {
  'missing-rewards': {
    title: `Don't Lose Your Rewards!`,
    description: `You're earning rewards, but they are in danger. Connect your EVM address before the end of the week to claim them.`,
    buttonText: (
      <>
        <SiEthereum className='h-[16.5px] w-[16.5px] [&>path]:fill-[#A16207]' />{' '}
        Connect wallet
      </>
    ),
  },
  'no-points': {
    title: 'Mint Your EPIC NFT To Start Earning!',
    description:
      'To be eligible for rewards, you need to mint at least one NFT Ticket.',
    buttonText: 'Mint NFT Ticket',
  },
}

type MissingRewardsProps = {
  address?: string
}

const MissingRewards = ({ address }: MissingRewardsProps) => {
  const setModalOpen = useProfileModal.use.openModal()

  const setDefaultModalState = useLoginModal.use.setDefaultOpenState()
  const myGrillAddress = useMyGrillAddress()
  const myAddress = useMyMainAddress()
  const { data: linkedIdentity, isLoading: isLinkedIdentitiyLoading } =
    getLinkedIdentityQuery.useQuery(myGrillAddress ?? '')
  const isNotLinkedEvm = !linkedIdentity?.externalProviders.find(
    (identity) => identity.provider === IdentityProvider.Evm
  )?.externalId

  const { data: isSufficient, isLoading: isSufficientLoading } =
    getIsBalanceSufficientQuery.useQuery(myAddress || '')

  let type: WarningType | undefined

  if (isNotLinkedEvm) {
    type = 'missing-rewards'
  } else if (!isSufficient) {
    type = 'no-points'
  } else {
    type = undefined
  }

  if (!type || isLinkedIdentitiyLoading || isSufficientLoading) return null

  const { title, description, buttonText } = warningPropsByType[type]

  return address === myAddress ? (
    <div className='flex flex-col gap-4 rounded-2xl border border-[#FDE047] bg-[#FEFCE8] p-4'>
      <div className='flex flex-col gap-1'>
        <div className='flex items-center justify-between gap-2'>
          <span className='text-base font-semibold leading-6 text-[#412006]'>
            {title}
          </span>
          <IoWarning className='h-6 w-6 [&>path]:fill-orange-400' />
        </div>
        <span className='text-sm font-normal leading-[22px] text-[#854D0F]'>
          {description}
        </span>
      </div>
      <Button
        variant='transparent'
        className='flex w-fit items-center gap-1 border border-[#EBB305] !px-[14px] !py-2 text-[#854D0F]'
        onClick={() => {
          setDefaultModalState('evm-address-link')
          setModalOpen({
            defaultOpenState: 'linked-accounts',
          })
        }}
      >
        {buttonText}
      </Button>
    </div>
  ) : null
}

export default MissingRewards
