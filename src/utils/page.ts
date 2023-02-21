import { AppCommonProps } from '@/pages/_app'
import { GetStaticProps } from 'next'

export function getCommonStaticProps<Props extends AppCommonProps>(
  params: Props
): GetStaticProps {
  return async () => {
    return {
      props: params,
    }
  }
}
