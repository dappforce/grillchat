import { cx, interactionRingStyles } from '@/utils/class-names'
import { Combobox, Transition } from '@headlessui/react'
import { GenericAccountId } from '@polkadot/types'
import registry from '@subsocial/api/utils/registry'
import { isEmptyArray } from '@subsocial/utils'
import clsx from 'clsx'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

export type InputItem = {
  id: string
  label: string
}

type AutocompleteInputProps = {
  items: InputItem[]
  value?: InputItem
  setValue: (item?: InputItem) => void
  label: string
}

const isSubstrateAddress = (account: string) => {
  try {
    new GenericAccountId(registry, account)
    return true
  } catch {
    return false
  }
}

const filterItems = (items: InputItem[], query: string) => {
  if (!query) return items

  const filteredItems = items.filter((item) =>
    item.label
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))
  )

  if (isSubstrateAddress(query)) {
    return isEmptyArray(filteredItems)
      ? ([{ id: query, label: query }] as InputItem[])
      : filteredItems
  }

  return filteredItems
}

const AutocompleteInput = ({
  items,
  value,
  setValue,
  label,
}: AutocompleteInputProps) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    setQuery(value?.label || '')
  }, [value])

  const filteredOptions = useMemo(() => filterItems(items, query), [query])

  return (
    <div className=''>
      <Combobox value={value} onChange={setValue}>
        <div className='relative mt-1'>
          <Combobox.Label className='mb-2 block bg-transparent text-sm font-normal leading-4 text-text-muted'>
            {label}
          </Combobox.Label>
          <div className='relative w-full cursor-pointer '>
            <Combobox.Button className={clsx('w-full')}>
              <Combobox.Input
                className={cx(
                  'relative w-full rounded-xl',
                  'h-[53px] py-2',
                  'pl-4 pr-12 text-left',
                  'appearance-none text-base ring-1 ring-border-gray',
                  'bg-background text-text',
                  interactionRingStyles()
                )}
                displayValue={(item: InputItem) => item.label}
                onChange={(event) => setQuery(event.target.value)}
              />

              <span className='pointer-events-none absolute inset-y-0 right-0 ml-2 flex items-center pr-4'>
                <IoIosArrowDown
                  className='h-5 w-5 text-text-muted'
                  aria-hidden='true'
                />
              </span>
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave='transition ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options
              className={cx(
                'rounded-lg bg-background-light shadow-[0_5px_50px_-12px_rgb(0,0,0,.25)] dark:shadow-[0_5px_50px_-12px_rgb(0,0,0)]',
                'absolute z-10 mt-1 max-h-56 w-full overflow-auto',
                'p-1.5 text-base shadow-lg',
                'ring-1 ring-black ring-opacity-5 focus-visible:outline-none sm:text-sm'
              )}
            >
              {filteredOptions.length === 0 && query !== '' ? (
                <div className='relative cursor-default select-none px-4 py-2 text-gray-700'>
                  Nothing found.
                </div>
              ) : (
                filteredOptions.map((item) => (
                  <AutocompleteItem key={item.id} item={item} />
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}

type AutocompleteItemProps = {
  item: InputItem
}

const AutocompleteItem = ({ item }: AutocompleteItemProps) => {
  return (
    <Combobox.Option
      key={item.id}
      className={() =>
        cx(
          'relative flex items-center rounded-lg outline-none transition-colors',
          'gap-4 px-3 py-2 text-text hover:bg-background-lighter focus-visible:bg-background-lighter'
        )
      }
      value={item}
    >
      {({ selected, active }) => (
        <>
          <span
            className={`block truncate ${
              selected ? 'font-medium' : 'font-normal'
            }`}
          >
            {item.label}
          </span>
          {selected ? (
            <span
              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                active ? 'text-white' : 'text-teal-600'
              }`}
            >
              any
            </span>
          ) : null}
        </>
      )}
    </Combobox.Option>
  )
}

export default AutocompleteInput
