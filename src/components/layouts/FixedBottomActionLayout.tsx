import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import ScrollableContainer from '@/components/ScrollableContainer'
import { cx } from '@/utils/class-names'
import { HiOutlineChevronLeft } from 'react-icons/hi'
import { useBreakpointThreshold } from '../../hooks/useBreakpointThreshold'
import Button from '../Button'
import NavbarExtension from '../navbar/NavbarExtension'

export type FixedBottomActionLayoutProps = {
  children: React.ReactNode
  bottomPanel: JSX.Element
  title: string
  showTransparentNavbar?: boolean
}

export default function FixedBottomActionLayout({
  bottomPanel,
  children,
  title,
  showTransparentNavbar,
}: FixedBottomActionLayoutProps) {
  return (
    <DefaultLayout>
      <LayoutNavbarExtension
        title={title}
        transparent={!!showTransparentNavbar}
      />
      <ScrollableContainer className='flex flex-1 flex-col md:pb-24'>
        <Container as='div' className='flex flex-1 flex-col pb-8'>
          {children}
        </Container>
      </ScrollableContainer>
      <div className='sticky bottom-0 w-full md:fixed md:pr-2'>
        {bottomPanel}
      </div>
    </DefaultLayout>
  )
}

function LayoutNavbarExtension({
  title,
  transparent,
}: {
  title: string
  transparent: boolean
}) {
  const mdUp = useBreakpointThreshold('md')
  return (
    <NavbarExtension
      className={cx(
        'fixed w-full transition',
        transparent && 'border-none bg-transparent'
      )}
    >
      <div className='relative flex h-8 items-center justify-center py-1'>
        <div className='absolute top-1/2 left-0 -translate-y-1/2'>
          {mdUp || transparent ? (
            <LinkText
              href='/'
              variant='secondary'
              className='flex items-center'
            >
              <HiOutlineChevronLeft className='mr-1.5 text-xl' />
              <span>Back</span>
            </LinkText>
          ) : (
            <Button size='circle' href='/' variant='transparent'>
              <HiOutlineChevronLeft />
            </Button>
          )}
        </div>
        {!transparent && <h1>{title}</h1>}
      </div>
    </NavbarExtension>
  )
}
