import ProfilePreview from '@/components/ProfilePreview'
import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import Tabs from '@/components/Tabs'
import { useMyMainAddress } from '@/stores/my-account'
import { ContentProps } from '../types'

export default function ProfileSettingsContent({ address }: ContentProps) {
  const myAddress = useMyMainAddress()

  return (
    <div className='mt-2 flex flex-col gap-6'>
      <div className='flex flex-col rounded-2xl bg-background-lighter p-4'>
        <ProfilePreview address={address} />
      </div>
      <div className='flex flex-col gap-2'>
        <span className='text-text-muted '>Identity provider</span>
        <Tabs
          tabStyle='buttons'
          tabs={[
            { id: 'evm', text: 'EVM', content: () => <>asdfas</> },
            { id: 'polkadot', text: 'Polkadot', content: () => <>asdfas</> },
            {
              id: 'custom',
              text: 'Custom',
              content: () => <SubsocialProfileForm />,
            },
          ]}
        />
      </div>
    </div>
  )
}
