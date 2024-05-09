import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import { estimatedWaitTime } from '@/utils/network'
import { LoginModalContentProps } from '../LoginModalContent'
import useOauthLogin from '../hooks/useOauthLogin'

export default function LoadingStep({ closeModal }: LoginModalContentProps) {
  useOauthLogin({ onSuccess: closeModal })

  return (
    <div className='flex flex-col items-center gap-4'>
      <DynamicLoadedHamsterLoading />
      <span className='text-sm text-text-muted'>
        It may take up to {estimatedWaitTime} seconds
      </span>
    </div>
  )
}
