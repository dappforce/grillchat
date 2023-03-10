import { AppCommonProps } from '@/pages/_app'
import { GetStaticProps } from 'next'

export function getCommonStaticProps<ReturnValue>(
  params: AppCommonProps,
  callback?: () => Promise<ReturnValue>
): GetStaticProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const data = callback ? await callback() : ({} as ReturnValue)
    return {
      props: {
        ...params,
        ...data,
      },
    }
  }
}

export function getCommonServerSideProps<ReturnValue>(
  params: AppCommonProps,
  callback?: (context: any) => Promise<ReturnValue | undefined>
): any {
  return async (context: any) => {
    if (typeof window !== 'undefined') return null
    const data = callback ? await callback(context) : undefined
    if (!data) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        ...params,
        ...data,
      },
    }
  }
}
