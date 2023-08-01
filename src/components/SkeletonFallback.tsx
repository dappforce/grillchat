import { cx } from '@/utils/class-names'
import { ComponentProps, useMemo } from 'react'

export type SkeletonFallbackProps = ComponentProps<'div'> & {
  isLoading?: boolean
  children: any
}

export default function SkeletonFallback({
  isLoading,
  children,
  className,
  ...props
}: SkeletonFallbackProps) {
  return isLoading === false || (isLoading === undefined && children) ? (
    children
  ) : (
    <div
      className={cx(
        'my-[0.25em] h-[1em] w-48 rounded-full bg-background-lighter',
        className
      )}
      {...props}
    />
  )
}

export type SkeletonProps = ComponentProps<'div'>
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cx(
        'my-[0.25em] h-[1em] w-48 rounded-full bg-background-lightest dark:bg-background-lighter',
        className
      )}
      {...props}
    />
  )
}

export interface IntegratedSkeletonProps<T>
  extends Omit<SkeletonFallbackProps, 'children'> {
  content: T | null | undefined
  defaultContent?: any
  children?: (content: T) => JSX.Element | string | number | null | undefined
}

export function useIntegratedSkeleton(
  ...data: Parameters<typeof generateLoadingChecker>
) {
  return useMemo(() => {
    const { loadingChecker, getContent } = generateLoadingChecker(...data)
    return {
      IntegratedSkeleton: function IntegratedSkeleton<T>({
        content,
        defaultContent,
        children,
        ...props
      }: IntegratedSkeletonProps<T>) {
        const shouldRenderDefaultContent = loadingChecker(content) || !content
        return (
          <SkeletonFallback {...props} isLoading={loadingChecker(content)}>
            {(() => {
              if (shouldRenderDefaultContent) {
                return defaultContent
              } else if (children) {
                return children(content) ?? null
              } else {
                return content
              }
            })()}
          </SkeletonFallback>
        )
      },
      loadingChecker,
      getContent,
    }
  }, [data])
}

function generateLoadingChecker(isLoading: boolean, isFetched = true) {
  const loadingChecker = (content: any) =>
    !!(isLoading || (!content && !isFetched))
  return {
    loadingChecker,
    getContent: <Content, Default>(content: Content, defaultContent: Default) =>
      loadingChecker(content) || !content ? defaultContent : content,
  }
}
