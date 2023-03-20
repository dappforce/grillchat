import CustomizeImage from '@/assets/graphics/customize.png'
import FeaturesImage from '@/assets/graphics/features.png'
import LaunchCommunityImage from '@/assets/graphics/launch-community.png'
import SetupChatImage from '@/assets/graphics/setup-chat.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import Image from 'next/image'
import { HiOutlineChevronLeft } from 'react-icons/hi'

export default function LaunchCommunityPage() {
  return (
    <DefaultLayout>
      <Container as='div' className='flex flex-1 flex-col overflow-auto pb-8'>
        <div className='relative'>
          <LinkText
            href='/'
            variant='secondary'
            className='absolute top-0 left-0 my-4 flex items-center'
          >
            <HiOutlineChevronLeft className='mr-1.5 text-2xl' />
            <span>Back</span>
          </LinkText>
        </div>
        <div className='flex flex-1 flex-col gap-20 text-center'>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <Image
              className='rounded-full'
              priority
              quality={100}
              src={LaunchCommunityImage}
              alt=''
            />
            <h1 className='text-3xl font-bold'>🚀 Launch your own community</h1>
            <p className='text-text-muted'>
              Grill.chat streamlines the process of setting up an anonymous chat
              group for your brand or community.
            </p>
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>🎨 Customization</h2>
            <p className='text-text-muted'>
              Customize your community&apos;s look and feel with our selection
              of options, including personalized backgrounds, colors, message
              bubbles, logos, and more!
            </p>
            <Image
              src={CustomizeImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>⚙️ Set up your chat</h2>
            <p className='text-text-muted'>
              Create a branded hub for your community by configuring a custom
              domain with your{' '}
              <LinkText
                className='font-bold'
                variant='primary'
                href='https://polkaverse.com/dd'
              >
                Subsocial username
              </LinkText>
              .
            </p>
            <Image
              src={SetupChatImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
            <Button className='w-full' size='lg'>
              Join Waitlist
            </Button>
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>📦 Web3 native features</h2>
            <p className='text-text-muted'>
              Discover the future of Web3 with new features on the horizon, such
              as integrating tips and token transfers directly into communities.
              Discuss NFTs and other web3 assets.
            </p>
            <Image
              src={FeaturesImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
            <p className='text-text-muted'>
              Provide feedback and vote for the features that you want to see
              most
            </p>
            <Button className='w-full' size='lg'>
              Vote for features
            </Button>
          </div>
        </div>
      </Container>
      <Container className='border-t border-border-gray bg-background-light py-4'>
        <Button className='w-full' size='lg'>
          Join Waitlist
        </Button>
      </Container>
    </DefaultLayout>
  )
}
