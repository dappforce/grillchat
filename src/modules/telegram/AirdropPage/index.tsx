import Tokens from '@/assets/graphics/airdrop/tokens.png'
import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Card from '@/components/Card'
import { CopyTextInline } from '@/components/CopyText'
import Name from '@/components/Name'
import { Skeleton } from '@/components/SkeletonFallback'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import useLinkedEvmAddress from '@/hooks/useLinkedEvmAddress'
import PointsWidget from '@/modules/points/PointsWidget'
import { useMyMainAddress } from '@/stores/my-account'
import { useProfileModal } from '@/stores/profile-modal'
import { truncateAddress } from '@/utils/account'
import { cx } from '@/utils/class-names'
import Image from 'next/image'
import { RiPencilFill } from 'react-icons/ri'
import { SiEthereum } from 'react-icons/si'
import { TbCoins } from 'react-icons/tb'

export default function AirdropPage() {
  const myAddress = useMyMainAddress()
  const openProfileModal = useProfileModal.use.openModal()
  const { evmAddress, isLoading } = useLinkedEvmAddress()

  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <PointsWidget className='sticky top-0' />
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <TokenGraphics />
          <div className='flex flex-col gap-2 text-center'>
            <span className='text-lg font-semibold'>Rewards soon</span>
            <span className='text-text-muted'>
              Points are in-app rewards exchangeable for something really cool
              later
            </span>
          </div>
        </div>
        <div className='px-4'>
          <Card className='flex flex-col items-center gap-4 bg-background-light'>
            <AddressAvatar address={myAddress ?? ''} className='h-16 w-16' />
            <div className='flex items-center gap-3'>
              <Name address={myAddress ?? ''} className='text-lg font-medium' />
              <Button
                size='circleSm'
                variant='muted'
                className='inline'
                onClick={() =>
                  openProfileModal({ defaultOpenState: 'profile-settings' })
                }
              >
                <RiPencilFill />
              </Button>
            </div>
            {isLoading ? (
              <Skeleton className='w-12' />
            ) : evmAddress ? (
              <div className='-mt-2 flex flex-col gap-1'>
                <div className='flex flex-row items-center gap-1.5'>
                  <SiEthereum className='text-xl text-text-muted' />
                  <CopyTextInline
                    text={truncateAddress(evmAddress)}
                    tooltip='Copy my address'
                    textToCopy={evmAddress}
                    textClassName={cx(
                      'font-mono text-base whitespace-nowrap overflow-hidden overflow-ellipsis'
                    )}
                  />
                </div>
              </div>
            ) : (
              <Button
                className='mt-0.5 flex items-center gap-1.5'
                onClick={() =>
                  openProfileModal({ defaultOpenState: 'add-evm-provider' })
                }
              >
                <TbCoins />
                <span>Set Rewards Address</span>
              </Button>
            )}
          </Card>
        </div>
      </div>
    </LayoutWithBottomNavigation>
  )
}

function TokenGraphics() {
  return (
    <div className='relative overflow-clip'>
      <Image src={Tokens} alt='' />
    </div>
  )
}
