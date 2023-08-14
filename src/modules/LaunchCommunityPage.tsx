import CustomizeImage from '@/assets/graphics/customize.png'
import FeaturesImage from '@/assets/graphics/features.png'
import LaunchCommunityImage from '@/assets/graphics/launch-community.png'
import SetupChatImage from '@/assets/graphics/setup-chat.png'
import Button from '@/components/Button'
import ClickableMedia from '@/components/ClickableMedia'
import Container from '@/components/Container'
import FixedBottomActionLayout from '@/components/layouts/FixedBottomActionLayout'
import LinkText from '@/components/LinkText'
import { SUGGEST_FEATURE_LINK } from '@/constants/links'
import { getBlurFallbackStyles } from '@/utils/class-names'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

const GITHUB_LINK = 'https://github.com/dappforce/grillchat'

export default function LaunchCommunityPage() {
  const { ref, inView } = useInView({ initialInView: true })
  const title = '🚀 Launch your own community'

  return (
    <FixedBottomActionLayout
      title={title}
      isTransparentNavbar={inView}
      bottomPanel={
        <Container
          as='div'
          className='flex justify-center border-t border-border-gray bg-background-light py-4 md:rounded-t-[30px]'
        >
          <Button
            className='w-full max-w-sm'
            size='lg'
            href='https://forms.gle/9ByHSa9rzAuAsDmHA'
            target='_blank'
            rel='noopener noreferrer'
          >
            Join Waitlist
          </Button>
        </Container>
      }
    >
      <div className='flex flex-1 flex-col gap-[60px] text-center [&>*]:z-[5]'>
        <div className='mt-4 flex flex-col items-center gap-4'>
          <Image
            className='w-full max-w-xs rounded-full'
            priority
            src={LaunchCommunityImage}
            alt=''
          />
          <h1 className='text-3xl font-semibold' ref={ref}>
            {title}
          </h1>
          <p className='text-text-muted'>
            Grill.chat streamlines the process of setting up an anonymous chat
            group for your brand or community. Use our{' '}
            <LinkText
              href={GITHUB_LINK}
              variant='primary'
              className='font-semibold'
              openInNewTab
            >
              open source code
            </LinkText>{' '}
            to start your own group
          </p>
        </div>
        <div className='mt-4 flex flex-col items-center gap-4 [&>*]:z-[5]'>
          <h2 className='text-2xl'>🎨 Customization</h2>
          <p className='text-text-muted'>
            Customize your community&apos;s look and feel with our selection of
            options, including personalized backgrounds, colors, message
            bubbles, logos, and more!
          </p>
          <div className='relative !z-0'>
            <div
              className='visible absolute top-0 !z-0 h-full w-full rounded-full bg-background-accent blur-[225px]'
              style={getBlurFallbackStyles()}
            />
            <ClickableMedia
              src={CustomizeImage}
              alt=''
              className='relative w-full max-w-sm'
            />
          </div>
        </div>
        <div className='mt-4 flex flex-col items-center gap-4'>
          <h2 className='text-2xl'>⚙️ Set up your chat</h2>
          <p className='text-text-muted'>
            Create a branded hub for your community by configuring a custom
            domain with your{' '}
            <LinkText
              className='font-semibold'
              variant='primary'
              href='https://polkaverse.com/dd'
              openInNewTab
            >
              Subsocial username
            </LinkText>
            .
          </p>
          <Image
            src={SetupChatImage}
            alt=''
            className='w-full max-w-sm rounded-2xl'
          />
        </div>
        <div className='mt-4 flex flex-col items-center gap-4 [&>*]:z-[5]'>
          <h2 className='text-2xl'>📦 Web3 native features</h2>
          <p className='text-text-muted'>
            Discover the future of Web3 with new features on the horizon, such
            as integrating tips and token transfers directly into communities.
            Discuss NFTs and other web3 assets.
          </p>
          <div className='relative !z-0'>
            <div
              className='visible absolute top-0 !z-0 h-full w-full rounded-full bg-background-accent blur-[225px]'
              style={getBlurFallbackStyles()}
            />
            <Image
              src={FeaturesImage}
              alt=''
              className='relative w-full max-w-sm'
            />
          </div>
          <p className='text-text-muted'>
            Provide feedback and vote for the features that you want to see most
          </p>
          <Button
            variant='primaryOutline'
            className='w-full max-w-sm'
            size='lg'
            href={SUGGEST_FEATURE_LINK}
            target='_blank'
            rel='noopener noreferrer'
          >
            Vote for features
          </Button>
        </div>
      </div>
    </FixedBottomActionLayout>
  )
}
