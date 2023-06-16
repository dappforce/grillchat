import { isTouchDevice } from '@/utils/device'
import { RefObject, useCallback, useRef } from 'react'

export default function useAutofocus() {
  const innerRef = useRef<HTMLElement | null>(null)

  return {
    ref: innerRef as RefObject<any>,
    autofocus: useCallback(
      (config?: {
        ref?: RefObject<any>
        autofocusInTouchDevices?: boolean
      }) => {
        const { autofocusInTouchDevices, ref } = config || {}
        const usedRef = ref || innerRef
        if (autofocusInTouchDevices) {
          usedRef.current?.focus()
          return
        }

        if (isTouchDevice()) return
        usedRef.current?.focus()
      },
      []
    ),
  }
}
