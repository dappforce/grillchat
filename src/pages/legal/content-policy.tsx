import Container from '@/components/Container'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import html from './content-policy.md'

export default function ContentPolicyPage() {
  return (
    <DefaultLayout>
      <Container
        dangerouslySetInnerHTML={{ __html: html }}
        className='prose pb-12 pt-6'
      />
    </DefaultLayout>
  )
}
