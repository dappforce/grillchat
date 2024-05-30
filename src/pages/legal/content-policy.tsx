import Container from '@/components/Container'
import LayoutWithBottomNavigation from '@/components/layouts/LayoutWithBottomNavigation'
import html from './content-policy.md'

export default function ContentPolicyPage() {
  return (
    <LayoutWithBottomNavigation withFixedHeight className='relative'>
      <Container
        dangerouslySetInnerHTML={{ __html: html }}
        className='prose prose-invert pb-12 pt-6'
      />
    </LayoutWithBottomNavigation>
  )
}
