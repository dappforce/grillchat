import { cx } from '@/utils/class-names'
import { replaceUrl } from '@/utils/window'
import { Tab } from '@headlessui/react'
import { ComponentProps, Fragment, useEffect, useState } from 'react'
import Container from './Container'
import LinkText from './LinkText'

type Tab = {
  id: string
  text: string
  content: (changeTab: (selectedTab: number) => void) => JSX.Element
}
export type TabsProps = ComponentProps<'div'> & {
  asContainer?: boolean
  tabs: Tab[]
  panelClassName?: string
  defaultTab?: number
  hideBeforeHashLoaded?: boolean
}

export default function Tabs({
  asContainer,
  tabs,
  panelClassName,
  defaultTab = 0,
  hideBeforeHashLoaded,
  ...props
}: TabsProps) {
  const [selectedIndex, setSelectedIndex] = useState(defaultTab)
  const [isHashLoaded, setIsHashLoaded] = useState(false)

  useEffect(() => {
    const hash = window.location.hash
    const index = tabs.findIndex(({ id }) => `#${id}` === hash)
    if (index > -1) setSelectedIndex(index)

    setIsHashLoaded(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeTab = (index: number) => {
    setSelectedIndex(index)
    const id = tabs[index].id
    replaceUrl(`#${id}`)
  }

  const component = asContainer ? Container : 'div'
  const usedSelectedIndex =
    hideBeforeHashLoaded || isHashLoaded ? selectedIndex : -1

  return (
    <Tab.Group selectedIndex={usedSelectedIndex} onChange={setSelectedIndex}>
      <Tab.List
        as={component}
        className={cx('flex items-end gap-4', props.className)}
      >
        {tabs.map(({ text, id }) => (
          <Tab key={id} as={Fragment}>
            {({ selected }) => (
              <LinkText
                className={cx(
                  'relative py-4 font-medium text-text-muted !outline-none transition-colors',
                  'after:absolute after:bottom-0 after:left-0 after:h-1 after:w-full after:origin-bottom after:scale-y-0 after:rounded-t-full after:bg-text-primary after:opacity-0 after:transition',
                  'hover:text-text-primary hover:after:scale-y-100 hover:after:opacity-100',
                  'focus-visible:text-text-primary focus-visible:after:scale-y-100 focus-visible:after:opacity-100',
                  selected &&
                    'text-text-primary after:scale-y-100 after:opacity-100'
                )}
                href={`#${id}`}
              >
                {text}
              </LinkText>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels as={component} className={cx('mt-2', panelClassName)}>
        {tabs.map(({ id, content }) => (
          <Tab.Panel key={id}>{content(changeTab)}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  )
}
