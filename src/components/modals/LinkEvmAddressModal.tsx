import { useAddExternalProviderToIdentity } from '@/services/datahub/identity/mutation'
import { IdentityProvider } from '@subsocial/data-hub-sdk'
import { getAddress, isAddress } from 'ethers'
import { useState } from 'react'
import Button from '../Button'
import Input from '../inputs/Input'
import Modal, { ModalFunctionalityProps } from './Modal'

export default function LinkEvmAddressModal(props: ModalFunctionalityProps) {
  const [evmAddress, setEvmAddress] = useState('')
  const [evmAddressError, setEvmAddressError] = useState('')
  const { mutate, isLoading } = useAddExternalProviderToIdentity({
    onSuccess: () => props.closeModal(),
  })
  const onSubmit = (e: any) => {
    e.preventDefault()
    const checksumAddress = getAddress(evmAddress)
    mutate({
      externalProvider: { id: checksumAddress, provider: IdentityProvider.EVM },
    })
  }

  return (
    <Modal {...props} title='Link your EVM Address' withCloseButton>
      <form onSubmit={onSubmit} className='mt-2 flex flex-col gap-4'>
        <Input
          error={evmAddressError}
          value={evmAddress}
          placeholder='0x...'
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
          Submit
        </Button>
      </form>
    </Modal>
  )
}
