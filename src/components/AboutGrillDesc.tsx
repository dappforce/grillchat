import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import LinkText from './LinkText'

export type AboutGrillDescProps = ComponentProps<'span'>

export default function AboutGrillDesc({ ...props }: AboutGrillDescProps) {
  return (
    <span {...props} className={cx(props.className)}>
      Engage in discussions anonymously without fear of social prosecution.
      Grill runs on the{' '}
      <LinkText
        variant='primary'
        href='https://subsocial.network/xsocial'
        openInNewTab
      >
        xSocial
      </LinkText>{' '}
      blockchain and stores your messages on the{' '}
      <LinkText openInNewTab href='https://ipfs.tech' variant='primary'>
        IPFS
      </LinkText>{' '}
      storage network.
    </span>
  )
}
