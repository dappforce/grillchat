import DefaultLayout from '@/components/layouts/DefaultLayout'
import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import { useEffect } from 'react'
import grill from '../../integration/index'

export default function IframePage() {
  useEffect(() => {
    grill.init({
      hub: { id: 'x' },
      onWidgetCreated: (iframe) => {
        iframe.src = iframe.src.replace(
          'https://grill.chat',
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
