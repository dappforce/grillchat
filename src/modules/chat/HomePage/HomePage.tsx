import Button from '@/components/Button'
import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ChatContent from './ChatContent'
import MainContent from './MainContent'

export type HomePageProps = {}

export default function HomePage() {
  return (
    <DefaultLayout withSidebar>
      <Container className='grid flex-1 grid-cols-1 gap-4 px-4 lg:grid-cols-[1fr_325px] xl:grid-cols-[1fr_375px]'>
        <MainContent />
        <ChatContent />
        <div className='sticky bottom-0 -mx-4 flex self-end border-t border-border-gray bg-background-light p-4 lg:hidden'>
          <Button
            className='flex w-full items-center justify-center gap-2'
            size='lg'
          >
            <span>Post memes & earn</span>
            <span className='text-white/70'>+3</span>
          </Button>
        </div>
      </Container>
    </DefaultLayout>
  )
}
