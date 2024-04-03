import Container from '@/components/Container'
import LinkText from '@/components/LinkText'
import NetworkStatus from '@/components/NetworkStatus'

export default function BottomPanel({
  withDesktopLeftOffset,
}: {
  withDesktopLeftOffset?: number
}) {
  return (
    <Container as='div' className='flex'>
      {withDesktopLeftOffset && (
        <div
          style={{ width: withDesktopLeftOffset }}
          className='pointer-events-none hidden flex-shrink-0 lg:block'
        />
      )}
      <div className='flex-1 pb-2 text-center text-sm text-text-muted'>
        <p className='inline'>
          Powered by{' '}
          <LinkText
            variant='primary'
            href='https://subsocial.network/'
            openInNewTab
          >
            Subsocial
          </LinkText>
        </p>
        <NetworkStatus className='ml-2 inline-block' />
      </div>
    </Container>
  )
}
