import { useState } from 'react'

export default function useRerender() {
  const [, rerender] = useState({})
  return () => rerender({})
}
