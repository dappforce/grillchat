import dynamic from 'next/dynamic'
import { HamsterLoadingProps } from './HamsterLoading'
import { Skeleton } from './SkeletonFallback'

const HamsterLoading = dynamic(() => import('./HamsterLoading'), {
  ssr: false,
  loading: () => <Skeleton className='h-64 w-64 rounded-full' />,
})

export default function DynamicLoadedHamsterLoading({
  ...props
}: HamsterLoadingProps) {
  return <HamsterLoading {...props} />
}
