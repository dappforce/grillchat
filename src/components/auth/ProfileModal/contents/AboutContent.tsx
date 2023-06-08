import AboutGrillDesc from '@/components/AboutGrillDesc'
import LinkText from '@/components/LinkText'
import Logo from '@/components/Logo'

function AboutContent() {
  return (
    <div className='mt-2 flex flex-col gap-4'>
      <div className='flex justify-center'>
        <Logo className='text-5xl' />
      </div>
      <AboutGrillDesc className='text-text-muted' />
      <div className='rounded-2xl border border-background-warning px-4 py-2 text-text-warning'>
        xSocial is an experimental environment for innovative web3 social
        features before they are deployed on{' '}
        <LinkText
          openInNewTab
          href='https://subsocial.network'
          variant='primary'
        >
          Subsocial
        </LinkText>
      </div>
    </div>
  )
}

export default AboutContent
