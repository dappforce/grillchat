import { AppCommonProps } from '@/pages/_app'
import { GetStaticProps } from 'next'

export function getCommonStaticProps<ReturnValue>(
  params: AppCommonProps,
  callback?: () => Promise<ReturnValue>
): GetStaticProps<AppCommonProps & ReturnValue> {
  return async () => {
    const data = callback ? await callback() : ({} as ReturnValue)
    return {
      props: {
        ...params,
        ...data,
      },
    }
  }
}
