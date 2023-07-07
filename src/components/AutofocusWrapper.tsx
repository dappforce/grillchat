import useAutofocus from '@/hooks/useAutofocus'
import React, { useEffect } from 'react'

export type AutofocusWrapperProps = {
  children: (props: { ref: React.MutableRefObject<any> }) => JSX.Element
  autofocusInTouchDevices?: boolean
}

export default function AutofocusWrapper({
  children,
  autofocusInTouchDevices,
}: AutofocusWrapperProps) {
  const { ref, autofocus } = useAutofocus()
  useEffect(() => {
    autofocus({ autofocusInTouchDevices })
  }, [autofocus, autofocusInTouchDevices])

  return children({ ref })
}
