import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import { cx } from '@/utils/class-names'
import { useRef, useState } from 'react'
import { Options, useHotkeys } from 'react-hotkeys-hook'
import { BsXCircleFill } from 'react-icons/bs'
import { HiMagnifyingGlass } from 'react-icons/hi2'

export type NavbarWithSearchProps = {
  customContent: (searchButton: JSX.Element) => JSX.Element
  searchProps: {
    search: string
    setSearch: (search: string) => void
    removeFocusedElement: () => void
    onUpClick: () => void
    onDownClick: () => void
  }
}

export default function NavbarWithSearch({
  customContent,
  searchProps: {
    search,
    setSearch,
    removeFocusedElement,
    onUpClick,
    onDownClick,
  },
}: NavbarWithSearchProps) {
  const [isOpenSearch, setIsOpenSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const clearOrCloseSearch = () => {
    removeFocusedElement()
    if (search) {
      setSearch('')
      searchRef.current?.focus()
    } else {
      setIsOpenSearch(false)
      searchRef.current?.blur()
    }
  }
  useHotkeys('esc', clearOrCloseSearch, {
    keydown: true,
    enableOnFormTags: ['INPUT'],
  })

  const openSearch = () => {
    setIsOpenSearch(true)
    searchRef.current?.focus()
  }
  useHotkeys('/, meta+k, ctrl+k', openSearch, {
    enabled: !isOpenSearch,
    preventDefault: true,
  })

  const arrowHotKeyOptions: Options = {
    enabled: isOpenSearch,
    preventDefault: true,
    keydown: true,
    enableOnFormTags: ['INPUT'],
  }
  useHotkeys('up', onUpClick, arrowHotKeyOptions)
  useHotkeys('down', onDownClick, arrowHotKeyOptions)

  const searchButton = (
    <Button
      size='circle'
      variant='transparent'
      className='text-text-muted dark:text-text'
      onClick={() => {
        setIsOpenSearch(true)
        searchRef.current?.focus()
      }}
    >
      <HiMagnifyingGlass className='text-xl' />
    </Button>
  )

  return (
    <div className='relative flex w-full'>
      <div
        className={cx(
          'absolute left-0 top-1/2 z-10 w-full -translate-y-1/2 transition-opacity',
          !isOpenSearch && 'pointer-events-none opacity-0'
        )}
      >
        <Input
          ref={searchRef}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftElement={(className) => (
            <HiMagnifyingGlass
              className={cx(className, 'z-10 ml-1 text-xl text-text-muted')}
            />
          )}
          rightElement={(className) => (
            <Button
              variant='transparent'
              size='noPadding'
              className={cx(
                className,
                'z-10 mr-1 cursor-pointer text-xl text-text-muted'
              )}
              onClick={clearOrCloseSearch}
            >
              <BsXCircleFill />
            </Button>
          )}
          size='sm'
          pill
          placeholder='Search rooms'
          variant='fill'
          className='bg-background pl-10'
        />
      </div>
      <div
        className={cx(
          'relative z-0 flex max-w-full flex-grow-0 items-center justify-between transition-opacity',
          isOpenSearch && 'opacity-0'
        )}
      >
        {customContent(searchButton)}
      </div>
    </div>
  )
}
