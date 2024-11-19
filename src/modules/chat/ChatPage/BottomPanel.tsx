import Container from '@/components/Container'
import LinkText from '@/components/LinkText'

export default function BottomPanel() {
  return (
    <Container as='div' className='flex'>
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
      </div>
    </Container>
  )
}
