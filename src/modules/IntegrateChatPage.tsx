import BenefitsImage from '@/assets/graphics/benefits.png'
import ChatboxLight from '@/assets/graphics/chatbox-light.svg'
import Chatbox from '@/assets/graphics/chatbox.svg'
import Embed2Image from '@/assets/graphics/embed-2.png'
import EmbedImage from '@/assets/graphics/embed.png'
import MigrateImage from '@/assets/graphics/migrate.png'
import Button from '@/components/Button'
import ClickableMedia from '@/components/ClickableMedia'
import Container from '@/components/Container'
import FixedBottomActionLayout from '@/components/layouts/FixedBottomActionLayout'
import { useSendEvent } from '@/stores/analytics'
import { useLocation } from '@/stores/location'
import { getBlurFallbackStyles } from '@/utils/class-names'
import Image from 'next/image'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function IntegrateChatPage() {
  const sendEvent = useSendEvent()
  const { ref, inView } = useInView({ initialInView: true })
  const title = '🛠 Add a chatbox to any existing app'
  const prevLocation = useLocation((state) => state.prevUrl)

  useEffect(() => {
    sendEvent('open_integrate_chat_lp', {
      eventSource: prevLocation ? 'pinned-chat' : 'direct',
    })
  }, [sendEvent])

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
            href='https://github.com/dappforce/grillchat/tree/main/integration#readme'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() => sendEvent('open_integrate_chat_docs')}
          >
            Integrate
          </Button>
        </Container>
      }
    >
      <div className='flex flex-1 flex-col gap-[60px] text-center [&>*]:z-[5]'>
        <div className='mt-14 flex flex-col items-center gap-4'>
          <ChatboxLight className='w-80 max-w-full dark:hidden' />
          <Chatbox className='hidden w-80 max-w-full dark:block' />
          <h1 ref={ref} className='text-3xl font-semibold'>
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
            <div
              className='visible absolute top-1/2 !z-0 w-full -translate-y-1/2 rounded-full bg-background-accent pt-[100%] blur-[225px]'
              style={getBlurFallbackStyles()}
            />
            <ClickableMedia
              src={EmbedImage}
              alt=''
              className='relative w-full max-w-2xl'
            />
            <ClickableMedia
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
          <Image src={MigrateImage} alt='' className='w-full max-w-xs' />
        </div>
        <div className='mt-4 flex flex-col items-center gap-4'>
          <h2 className='text-2xl'>🏄‍♂️ Experience the benefits</h2>
          <p className='text-text-muted'>
            On-chain communities allow for user reputation, increased
            transparency, and improved user freedom
          </p>
          <Image src={BenefitsImage} alt='' className='w-full max-w-xs' />
        </div>
      </div>
    </FixedBottomActionLayout>
  )
}
