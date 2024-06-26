import grill from '@/../integration/index'
import DefaultLayout from '@/components/layouts/DefaultLayout'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { useEffect } from 'react'

export default function IframePage() {
  useEffect(() => {
    grill.init({
      hub: { id: 'featured' },
      onWidgetCreated: (iframe) => {
        iframe.src = iframe.src.replace(
          'https://grillapp.net',
          getCurrentUrlOrigin()
        )
        return iframe
      },
    })
  }, [])

  return (
    <DefaultLayout>
      <div
        id='grill'
        className={cx('mx-auto w-full max-w-md')}
        style={{ height: '600px', maxHeight: '100vh' }}
      />
    </DefaultLayout>
  )
}
