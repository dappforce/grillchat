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
  params: AppCommonProps,
  callback?: (
    context: GetStaticPropsContext<ParsedUrlQuery, PreviewData>
  ) => Promise<{ props: ReturnValue; revalidate?: number } | undefined>
): GetStaticProps<AppCommonProps & ReturnValue> {
  return async (context) => {
    const data = callback
      ? await callback(context)
      : ({ props: {} } as {
          props: ReturnValue
          revalidate: number | undefined
        })
    if (!data) {
      return {
        notFound: true,
      }
    }
    return {
      props: {
        ...params,
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
