import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import LinkText from '@/components/LinkText'
import ScrollableContainer from '@/components/ScrollableContainer'
import { cx } from '@/utils/class-names'
import { HiOutlineChevronLeft } from 'react-icons/hi'
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
  return (
    <NavbarExtension
      className={cx(transparent && 'fixed w-full border-none bg-transparent')}
    >
      <div className='relative flex items-center justify-center py-1'>
        <LinkText
          href='/'
          variant='secondary'
          className='absolute top-1/2 left-0 flex -translate-y-1/2 items-center'
        >
          <HiOutlineChevronLeft className='mr-1.5 text-xl' />
          <span>Back</span>
        </LinkText>
        <h1>{title}</h1>
      </div>
    </NavbarExtension>
  )
}
