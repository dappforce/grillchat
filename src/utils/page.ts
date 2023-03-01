import { AppCommonProps } from '@/pages/_app'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

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
  callback?: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<ReturnValue>
): GetServerSideProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const data = callback ? await callback(context) : ({} as ReturnValue)
    return {
      props: {
        ...params,
        ...data,
      },
    }
  }
}
