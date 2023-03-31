import BenefitsImage from '@/assets/graphics/benefits.png'
import Chatbox from '@/assets/graphics/chatbox.svg'
import Embed2Image from '@/assets/graphics/embed-2.png'
import EmbedImage from '@/assets/graphics/embed.png'
import MigrateImage from '@/assets/graphics/migrate.png'
import Button from '@/components/Button'
import Container from '@/components/Container'
import FixedBottomActionLayout from '@/components/layouts/FixedBottomActionLayout'
import { useSendEvent } from '@/stores/analytics'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'

export default function IntegrateChatPage() {
  const sendEvent = useSendEvent()
  const { ref, inView } = useInView({ initialInView: true })
  const title = '🛠 Add a chatbox to any existing app'

  return (
    <FixedBottomActionLayout
      title={title}
      showTransparentNavbar={inView}
      bottomPanel={
        <Container
          as='div'
          className='flex justify-center border-t border-border-gray bg-background-light py-4 md:rounded-t-[30px]'
        >
          <Button
            className='w-full max-w-sm'
            size='lg'
            onClick={() => sendEvent('click integrate_button')}
          >
            Integrate
          </Button>
        </Container>
      }
    >
      <div className='flex flex-1 flex-col gap-20 text-center [&>*]:z-[5]'>
        <div className='mt-14 flex flex-col items-center gap-4'>
          <Chatbox className='w-80' />
          <h1 ref={ref} className='text-3xl font-bold'>
            {title}
          </h1>
          <p className='text-text-muted'>
            Enable your community to develop and grow right inside of your
            application
          </p>
        </div>
        <div className='mt-4 flex flex-col items-center gap-4 [&>*]:z-[5]'>
          <h2 className='text-2xl'>📦 Embed chat functionality</h2>
          <p className='text-text-muted'>
            Enhance user engagement in your applications by leveraging Web3
            native social integrations
          </p>
          <div className='relative !z-0 flex flex-col items-center gap-4'>
            <div className='visible absolute top-1/2 !z-0 w-full -translate-y-1/2 rounded-full bg-background-accent pt-[100%] blur-[225px]' />
            <Image
              src={EmbedImage}
              alt=''
              className='relative w-full max-w-2xl'
            />
            <Image
              src={Embed2Image}
              alt=''
              className='relative w-full max-w-2xl'
            />
          </div>
        </div>
        <div className='mt-4 flex flex-col items-center gap-4'>
          <h2 className='text-2xl'>🔗 Keep it Web3</h2>
          <p className='text-text-muted'>
            Migrate your community on-chain, instead of forcing it to live
            through Web2 tools like Twitter and Telegram
          </p>
          <Image src={MigrateImage} alt='' className='w-full max-w-sm' />
        </div>
        <div className='mt-4 flex flex-col items-center gap-4'>
          <h2 className='text-2xl'>🏄‍♂️ Experience the benefits</h2>
          <p className='text-text-muted'>
            On-chain communities allow for user reputation, increased
            transparency, and improved user freedom
          </p>
          <Image src={BenefitsImage} alt='' className='w-full max-w-sm' />
        </div>
      </div>
    </FixedBottomActionLayout>
  )
}
