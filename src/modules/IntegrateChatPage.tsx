import BenefitsImage from '@/assets/graphics/benefits.png'
import Chatbox from '@/assets/graphics/chatbox.svg'
import Embed2Image from '@/assets/graphics/embed-2.png'
import EmbedImage from '@/assets/graphics/embed.png'
import MigrateImage from '@/assets/graphics/migrate.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import Image from 'next/image'
import { HiOutlineChevronLeft } from 'react-icons/hi'

export default function IntegrateChatPage() {
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
          <div className='mt-16 flex flex-col items-center gap-4'>
            <Chatbox className='w-56' />
            <h1 className='text-3xl font-bold'>
              🛠 Add a chatbox to any existing app
            </h1>
            <p className='text-text-muted'>
              Enable your community to develop and grow right inside of your
              application
            </p>
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>📦 Embed chat functionality</h2>
            <p className='text-text-muted'>
              Enhance user engagement in your applications by leveraging Web3
              native social integrations
            </p>
            <Image
              src={EmbedImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
            <Image
              src={Embed2Image}
              quality={100}
              alt=''
              className='max-w-full'
            />
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>🔗 Keep it Web3</h2>
            <p className='text-text-muted'>
              Migrate your community on-chain, instead of forcing it to live
              through Web2 tools like Twitter and Telegram
            </p>
            <Image
              src={MigrateImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
          </div>
          <div className='mt-4 flex flex-col items-center gap-4'>
            <h2 className='text-2xl'>🏄‍♂️ Experience the benefits</h2>
            <p className='text-text-muted'>
              On-chain communities allow for user reputation, increased
              transparency, and improved user freedom
            </p>
            <Image
              src={BenefitsImage}
              quality={100}
              alt=''
              className='max-w-full'
            />
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
