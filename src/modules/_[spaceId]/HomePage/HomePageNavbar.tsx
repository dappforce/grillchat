import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import useWrapInRef from '@/hooks/useWrapInRef'
import { cx } from '@/utils/class-names'
import { useEffect, useRef, useState } from 'react'
import { BsXCircleFill } from 'react-icons/bs'
import { HiMagnifyingGlass } from 'react-icons/hi2'

export type HomePageNavbarProps = {
  logo: JSX.Element
  auth: JSX.Element
  colorModeToggler: JSX.Element
  search: string
  setSearch: (search: string) => void
  setFocusedElementIndex: React.Dispatch<React.SetStateAction<number>>
  onUpClick: () => void
  onDownClick: () => void
}

export default function HomePageNavbar({
  auth,
  colorModeToggler,
  logo,
  search,
  setSearch,
  onDownClick,
  onUpClick,
}: HomePageNavbarProps) {
  const [openSearch, setOpenSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const clearOrCloseSearch = useWrapInRef(() => {
    if (search) {
      setSearch('')
      searchRef.current?.focus()
    } else {
      setOpenSearch(false)
    }
  })

  useEffect(() => {
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearOrCloseSearch.current()
      }
    }
    window.addEventListener('keydown', keyListener)
    return () => window.removeEventListener('keydown', keyListener)
  }, [clearOrCloseSearch])

  useEffect(() => {
    if (openSearch) return
    const openSearchHotKeyListener = (e: KeyboardEvent) => {
      if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
        e.preventDefault()
        setOpenSearch(true)
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', openSearchHotKeyListener)
    return () => window.removeEventListener('keydown', openSearchHotKeyListener)
  }, [openSearch])

  const onUpClickRef = useWrapInRef(onUpClick)
  const onDownClickRef = useWrapInRef(onDownClick)
  useEffect(() => {
    if (!openSearch) return
    const arrowListener = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        onDownClickRef.current()
      } else if (e.key === 'ArrowUp') {
        onUpClickRef.current()
      }
    }
    window.addEventListener('keydown', arrowListener)
    return () => window.removeEventListener('keydown', arrowListener)
  }, [openSearch, onUpClickRef, onDownClickRef])

  return (
    <div className='relative'>
      <div
        className={cx(
          'absolute top-1/2 left-0 z-10 w-full -translate-y-1/2 transition-opacity',
          !openSearch && 'pointer-events-none opacity-0'
        )}
      >
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={(className) => (
            <HiMagnifyingGlass
              className={cx(className, 'z-10 ml-1 text-text-muted')}
            />
          )}
          rightElement={(className) => (
            <Button
              variant='transparent'
              size='noPadding'
              className={cx(
                className,
                'z-10 mr-1 cursor-pointer text-text-muted'
              )}
              onClick={clearOrCloseSearch.current}
            >
              <BsXCircleFill />
            </Button>
          )}
          size='sm'
          pill
          placeholder='Search rooms'
          variant='fill'
          className='bg-background pl-9'
        />
      </div>
      <div
        className={cx(
          'relative z-0 flex items-center justify-between transition-opacity',
          openSearch && 'opacity-0'
        )}
      >
        {logo}
        <div className='flex items-center gap-2 text-text-muted dark:text-text'>
          <Button
            size='circle'
            variant='transparent'
            onClick={() => {
              setOpenSearch(true)
              searchRef.current?.focus()
            }}
          >
            <HiMagnifyingGlass />
          </Button>
          {colorModeToggler}
          <div className='ml-1.5'>{auth}</div>
        </div>
      </div>
    </div>
  )
}
