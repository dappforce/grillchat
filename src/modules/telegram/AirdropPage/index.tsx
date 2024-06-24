import Tokens from '@/assets/graphics/airdrop/tokens.png'
import AddressAvatar from '@/components/AddressAvatar'
import Button from '@/components/Button'
import Card from '@/components/Card'
import Name from '@/components/Name'
import { CommonEVMLoginContent } from '@/components/auth/common/evm/CommonEvmModalContent'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import Modal, { ModalFunctionalityProps } from '@/components/modals/Modal'
import SubsocialProfileModal from '@/components/subsocial-profile/SubsocialProfileModal'
import useIsModerationAdmin from '@/hooks/useIsModerationAdmin'
import useTgNoScroll from '@/hooks/useTgNoScroll'
import PointsWidget from '@/modules/points/PointsWidget'
import { useSendEvent } from '@/stores/analytics'
import { useMyMainAddress } from '@/stores/my-account'
import Image from 'next/image'
import { useState } from 'react'
import { RiPencilFill } from 'react-icons/ri'
import RemoveLinkedIdentityModal from './RemoveLinkedIdentityModal'

export default function AirdropPage() {
  useTgNoScroll()

  const isAdmin = useIsModerationAdmin()
  const [isOpenRemoveAccountModal, setIsOpenRemoveAccountModal] =
    useState(false)
  const [openProfileModal, setOpenProfileModal] = useState(false)
  const [openAddEvmModal, setOpenAddEvmModal] = useState(false)
  const myAddress = useMyMainAddress()
  const sendEvent = useSendEvent()

  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <PointsWidget isNoTgScroll className='sticky top-0' />
      <div className='flex flex-1 flex-col gap-4 overflow-auto'>
        <div className='flex flex-col'>
          <TokenGraphics />
          <div className='-mt-2 flex flex-col gap-2 text-center'>
            <span className='text-lg font-semibold'>Rewards soon</span>
            <span className='px-4 text-text-muted'>
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
                onClick={() => {
                  sendEvent('edit_profile_click')
                  setOpenProfileModal(true)
                }}
              >
                <RiPencilFill />
              </Button>
            </div>
            {isAdmin && (
              <div className='flex flex-col gap-2'>
                <Button
                  variant='redOutline'
                  onClick={() => {
                    sendEvent('remove_account_click')
                    setIsOpenRemoveAccountModal(true)
                  }}
                >
                  Remove Account
                </Button>
                <Button
                  variant='transparent'
                  onClick={() => {
                    sendEvent('clear_local_storage_click')
                    if (confirm('Are you sure to remove all local data?')) {
                      localStorage.clear()
                      window.location.reload()
                    }
                  }}
                >
                  Clear Local Data
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
      <RemoveLinkedIdentityModal
        isOpen={isOpenRemoveAccountModal}
        closeModal={() => setIsOpenRemoveAccountModal(false)}
      />
      <SubsocialProfileModal
        title='✏️ Edit Profile'
        closeModal={() => setOpenProfileModal(false)}
        isOpen={openProfileModal}
      />
      <AddEvmProviderModal
        isOpen={openAddEvmModal}
        closeModal={() => setOpenAddEvmModal(false)}
      />
    </LayoutWithBottomNavigation>
  )
}

export function AddEvmProviderModal(props: ModalFunctionalityProps) {
  const [isError, setIsError] = useState(false)
  const sendEvent = useSendEvent()

  return (
    <Modal
      {...props}
      title='🔑 Connect EVM'
      description='Create an on-chain proof to link your Epic account.'
      withCloseButton
    >
      <CommonEVMLoginContent
        mutationType='add-provider'
        buttonLabel={isError ? 'Try again' : undefined}
        onError={() => {
          setIsError(true)
        }}
        onSuccess={() => {
          sendEvent(`finish_add_provider_evm_standalone`)
          props.closeModal()
        }}
      />
    </Modal>
  )
}

function TokenGraphics() {
  return (
    <div className='relative overflow-clip'>
      <Image src={Tokens} alt='' />
    </div>
  )
}
