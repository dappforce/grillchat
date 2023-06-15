import { cx } from '@/utils/class-names'
import { getCurrentUrlOrigin } from '@/utils/links'
import grill from '@subsocial/grill-widget'
import { useEffect } from 'react'

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
    <div
      className={cx('grill', 'mx-auto w-full max-w-md')}
      style={{ height: '600px', maxHeight: '100vh' }}
    />
  )
}
