import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import { useProfileModal } from '@/stores/profile-modal'
import { useEffect } from 'react'
import { ProfileModalContentProps } from '../../types'

export default function SimpleProfileSettingsContent({
  setCurrentState,
}: ProfileModalContentProps) {
  const clearInternalProps = useProfileModal(
    (state) => state.clearInternalProps
  )
  useEffect(() => {
    return () => {
      clearInternalProps()
    }
  }, [clearInternalProps])

  return (
    <div className='flex flex-col'>
      <SubsocialProfileForm onSuccess={() => setCurrentState('account')} />
    </div>
  )
}
