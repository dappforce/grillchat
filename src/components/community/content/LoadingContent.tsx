import DynamicLoadedHamsterLoading from '@/components/DynamicLoadedHamsterLoading'
import { estimatedWaitTime } from '@/utils/network'

const LoadingContent = () => {
  return (
    <div className='flex flex-col items-center gap-4'>
      <DynamicLoadedHamsterLoading />
      <span className='text-sm text-text-muted'>
        It may take up to {estimatedWaitTime} seconds
      </span>
    </div>
  )
}

export default LoadingContent
