import DefaultLayout from '@/components/layouts/DefaultLayout'
import useIsMounted from '@/hooks/useIsMounted'
import HomePageContent from './HomePageContent'

export default function HomePage() {
  const isMounted = useIsMounted()
  return (
    <DefaultLayout className='relative'>
      {isMounted && <HomePageContent />}
    </DefaultLayout>
  )
}
