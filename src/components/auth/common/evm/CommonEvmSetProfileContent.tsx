import Button from '@/components/Button'
import ProfilePreview from '@/components/ProfilePreview'
import { getAccountDataQuery } from '@/services/subsocial/evmAddresses'
import { useMyMainAddress } from '@/stores/my-account'

export default function CommonEvmSetProfileContent({
  onSetEvmIdentityClick,
  onSkipClick,
}: {
  onSetEvmIdentityClick?: () => void
  onSkipClick?: () => void
}) {
  const myAddress = useMyMainAddress() ?? ''
  const { data } = getAccountDataQuery.useQuery(myAddress)
  const firstEnsName = data?.ensNames?.[0]

  return (
    <div className='flex w-full flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview
          address={myAddress}
          forceProfileSource={{ profileSource: 'ens', content: firstEnsName }}
        />
      </div>
      <div className='flex flex-col gap-4'>
        <Button size='lg' className='w-full' onClick={onSetEvmIdentityClick}>
          Yes, use EVM as default identity
        </Button>
        <Button
          size='lg'
          variant='primaryOutline'
          onClick={onSkipClick}
          className='w-full'
        >
          Nah, I&apos;m good
        </Button>
      </div>
    </div>
  )
}
