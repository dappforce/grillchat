import { AppCommonProps } from '@/pages/_app'
import { dehydrate, DehydratedState, QueryClient } from '@tanstack/react-query'
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

type DehydratedQueries = (Pick<
  DehydratedState['queries'][number],
  'queryHash' | 'queryKey'
> & { data: unknown })[]
export function dehydrateQueries(client: QueryClient): DehydratedQueries {
  const dehydratedState = dehydrate(client)
  const processedQueries: DehydratedQueries = []

  dehydratedState.queries.forEach((query) => {
    if (query.state.status !== 'success') return
    processedQueries.push({
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      data: query.state.data ?? null,
    })
  })

  return processedQueries
}
export function parseDehydratedState(
  dehydratedQueries: DehydratedQueries
): DehydratedState {
  return {
    mutations: [],
    queries: dehydratedQueries.map(({ data, queryHash, queryKey }) => ({
      queryKey,
      queryHash,
      state: {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: Date.now(),
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        fetchStatus: 'idle' as const,
        isInvalidated: false,
        status: 'success' as const,
      },
    })),
  }
}
