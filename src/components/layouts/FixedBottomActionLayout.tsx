import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import ScrollableContainer from '@/components/ScrollableContainer'

export type FixedBottomActionLayoutProps = {
  children: React.ReactNode
  bottomPanel: JSX.Element
  title: string
  isTransparentNavbar?: boolean
}

export default function FixedBottomActionLayout({
  bottomPanel,
  children,
  title,
  isTransparentNavbar,
}: FixedBottomActionLayoutProps) {
  return (
    <DefaultLayout
      withBackButton={{ title, isTransparent: isTransparentNavbar }}
    >
      <ScrollableContainer className='flex flex-1 flex-col md:pb-24'>
        <Container as='div' className='flex flex-1 flex-col pb-8'>
          {children}
        </Container>
      </ScrollableContainer>
      <div className='sticky bottom-0 z-10 w-full md:fixed md:pr-2'>
        {bottomPanel}
      </div>
    </DefaultLayout>
  )
}
