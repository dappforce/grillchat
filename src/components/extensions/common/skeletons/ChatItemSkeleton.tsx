import { Skeleton } from '@/components/SkeletonFallback'

export function ChatItemSkeleton() {
  return <Skeleton className='h-52 w-64 max-w-[250px] rounded-2xl' />
}

export function PreviewPartBodySkeleton() {
  return <Skeleton className='h-5 w-20 rounded-2xl' />
}

export function PreviewPartImageSkeleton() {
  return <Skeleton className='aspect-square w-4 rounded-2xl' />
}
