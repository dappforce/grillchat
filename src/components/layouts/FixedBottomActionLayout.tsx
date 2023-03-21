import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import ScrollableContainer from '@/components/ScrollableContainer'
import { HiOutlineChevronLeft } from 'react-icons/hi'

export type FixedBottomActionLayoutProps = {
  children: React.ReactNode
  bottomPanel: JSX.Element
}

export default function FixedBottomActionLayout({
  bottomPanel,
  children,
}: FixedBottomActionLayoutProps) {
  return (
    <DefaultLayout>
      <ScrollableContainer className='flex flex-1 flex-col md:pb-24'>
        <Container as='div' className='flex flex-1 flex-col pb-8'>
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
          {children}
        </Container>
      </ScrollableContainer>
      <div className='sticky bottom-0 w-full md:fixed md:pr-2'>
        {bottomPanel}
      </div>
    </DefaultLayout>
  )
}
