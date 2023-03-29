import { AppCommonProps } from '@/pages/_app'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  GetStaticPropsContext,
  PreviewData,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

export function getCommonStaticProps<ReturnValue>(
  getParams: (callbackReturn: ReturnValue) => AppCommonProps,
  callback?: (
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<{ props: ReturnValue; revalidate?: number } | undefined>
): GetStaticProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const EMPTY_PROPS = {} as ReturnValue
    const data = callback ? await callback(context) : { props: EMPTY_PROPS }
    if (!data) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        ...getParams(data.props),
        ...data.props,
      },
      revalidate: data.revalidate,
    }
  }
}

export function getCommonServerSideProps<ReturnValue>(
  params: AppCommonProps,
  callback?: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<ReturnValue | undefined>
): GetServerSideProps<AppCommonProps & ReturnValue> {
  return async (context) => {
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
