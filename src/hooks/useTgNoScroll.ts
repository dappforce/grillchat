import { useEffect } from 'react'

export default function useTgNoScroll() {
  useEffect(() => {
    const overflow = 500
    document.body.style.overflowY = 'hidden'
    document.body.style.marginTop = `${overflow}px`
    document.body.style.height = window.innerHeight + overflow + 'px'
    document.body.style.paddingBottom = `${overflow}px`
    window.scrollTo(0, overflow)

    return () => {
      document.body.style.overflowY = 'initial'
      document.body.style.marginTop = '0'
      document.body.style.height = 'auto'
      document.body.style.paddingBottom = '0'
    }
  }, [])
}
