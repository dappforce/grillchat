import Button from '@/components/Button'
import useLinkedEvmAddress from '@/hooks/useLinkedEvmAddress'
import { getIsBalanceSufficientQuery } from '@/services/datahub/balances/query'
import { SocialAction } from '@/services/datahub/generated-query'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { cx } from '@/utils/class-names'
import { IoWarning } from 'react-icons/io5'
import { SiEthereum } from 'react-icons/si'

type WarningType = 'missing-rewards' | 'no-points'

const warningPropsByType: Record<
  WarningType,
  {
    title: string
    description: string
    buttonText: React.ReactNode
    onClick?: () => void
    href?: string
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

const MissingRewards = () => {
  const setModalOpen = useProfileModal.use.openModal()

  const myAddress = useMyMainAddress()
  const { evmAddress: myEvmAddress, isLoading: isLinkedIdentityLoading } =
    useLinkedEvmAddress()
  const isNotLinkedEvm = !myEvmAddress

  const { data: isSufficient, isLoading: isSufficientLoading } =
    getIsBalanceSufficientQuery.useQuery({
      address: myAddress || '',
      socialAction: SocialAction.CreateComment,
    })

  let type: WarningType | undefined

  if (isLinkedIdentityLoading || isSufficientLoading) return null

  if (isNotLinkedEvm) {
    type = 'missing-rewards'
    warningPropsByType[type] = {
      ...warningPropsByType[type],
      onClick: () => {
        setModalOpen({
          defaultOpenState: 'add-evm-provider',
        })
      },
    }
  } else if (!isSufficient) {
    type = 'no-points'
    warningPropsByType[type] = {
      ...warningPropsByType[type],
      href: 'https://epicapp.net/what-is-meme2earn',
    }
  } else {
    type = undefined
  }

  if (!type) return null

  const { title, description, buttonText, href, onClick } =
    warningPropsByType[type]

  return myAddress ? (
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
        className={cx(
          'flex w-fit items-center gap-1  !px-[14px] !py-2 text-[#854D0F]',
          '!shadow-none outline outline-1 outline-[#EBB305] !ring-0 hover:outline-2'
        )}
        onClick={onClick}
        href={href}
        target={href ? '_blank' : undefined}
      >
        {buttonText}
      </Button>
    </div>
  ) : null
}

export default MissingRewards
