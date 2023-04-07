import { useRef } from 'react'

export default function useWrapCallbackInRef<T>(callback: T) {
  const ref = useRef<T>(callback)
  ref.current = callback
  return ref
}
