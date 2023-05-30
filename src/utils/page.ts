import { AppCommonProps } from '@/pages/_app'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetStaticProps,
  GetStaticPropsContext,
  PreviewData,
  Redirect,
} from 'next'
import { ParsedUrlQuery } from 'querystring'

type StaticPropsReturn<ReturnValue> =
  | { props: ReturnValue }
  | { redirect: Redirect }
type StaticPropsReturnWithCommonProps<ReturnValue> =
  StaticPropsReturn<ReturnValue> & { revalidate?: number }
export function getCommonStaticProps<ReturnValue>(
  getParams: (callbackReturn: ReturnValue) => AppCommonProps,
  callback?: (
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<StaticPropsReturnWithCommonProps<ReturnValue> | undefined>
): GetStaticProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const EMPTY_PROPS = {} as ReturnValue
    const data = callback ? await callback(context) : { props: EMPTY_PROPS }
    if (!data) {
      return {
        notFound: true,
      }
    }
    if ('redirect' in data) {
      return data
    }

    return {
      ...data,
      props: {
        ...getParams(data.props),
        ...data.props,
      },
    }
  }
}

export function getCommonServerSideProps<ReturnValue>(
  params: AppCommonProps,
  callback?: (
    context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<{ props: ReturnValue; redirect?: Redirect } | undefined>
): GetServerSideProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const data = callback ? await callback(context) : undefined
    if (!data) {
      return {
        notFound: true,
      }
    }

    return {
      redirect: data.redirect,
      props: {
        ...params,
        ...data.props,
      },
    }
  }
}
