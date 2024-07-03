import useLinkedEvmAddress from '@/hooks/useLinkedEvmAddress'
import { useAddExternalProviderToIdentity } from '@/services/datahub/identity/mutation'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { getAddress, isAddress } from 'ethers'
import { useEffect, useState } from 'react'
import Button from '../Button'
import Input from '../inputs/Input'
import Modal, { ModalFunctionalityProps, ModalProps } from './Modal'

export default function LinkEvmAddressModal(
  props: ModalFunctionalityProps & Pick<ModalProps, 'title' | 'description'>
) {
  const [evmAddress, setEvmAddress] = useState('')
  const [evmAddressError, setEvmAddressError] = useState('')
  const { mutate, isLoading } = useAddExternalProviderToIdentity({
    onSuccess: () => props.closeModal(),
  })

  const { evmAddress: myEvmAddress } = useLinkedEvmAddress()
  useEffect(() => {
    if (props.isOpen && myEvmAddress) {
      setEvmAddress(myEvmAddress)
    }
  }, [myEvmAddress, props.isOpen])

  const onSubmit = (e: any) => {
    e.preventDefault()
    const checksumAddress = getAddress(evmAddress)
    mutate({
      externalProvider: { id: checksumAddress, provider: IdentityProvider.EVM },
    })
  }

  return (
    <Modal
      {...props}
      title={props.title || 'Your EVM address for rewards'}
      description={
        props.description ??
        'We will send your token rewards to this address if you win this contest.'
      }
      withCloseButton
    >
      <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-6 pb-2'>
        <Input
          error={evmAddressError}
          value={evmAddress}
          placeholder='Your EVM address'
          onChange={(e) => {
            const address = e.target.value
            setEvmAddress(address)
            if (!isAddress(address)) {
              setEvmAddressError('Invalid EVM Address')
            } else {
              setEvmAddressError('')
            }
          }}
        />
        <Button isLoading={isLoading} size='lg' type='submit'>
          Save
        </Button>
      </form>
    </Modal>
  )
}
