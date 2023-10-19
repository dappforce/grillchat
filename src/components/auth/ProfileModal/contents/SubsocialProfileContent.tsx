import SubsocialProfileForm from '@/components/subsocial-profile/SubsocialProfileForm'
import { ContentProps } from '../types'

export default function SubsocialProfileContent({
  setCurrentState,
}: ContentProps) {
  return <SubsocialProfileForm onSuccess={() => setCurrentState('account')} />
}
