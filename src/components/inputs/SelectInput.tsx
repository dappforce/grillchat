import { cx } from '@/utils/class-names'
import { Listbox, Transition } from '@headlessui/react'
import Image, { StaticImageData } from 'next/image'
import { Fragment } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

export type ListItem = {
  icon: StaticImageData
  label: string
}

type SelectInputProps = {
  fieldLabel?: string
  items: ListItem[]
  selected: ListItem
  setSelected: (item: ListItem) => void
}

export default function SelectInput({
  items,
  fieldLabel,
  selected,
  setSelected,
}: SelectInputProps) {
  return (
    <div>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            {fieldLabel && (
              <Listbox.Label className='block text-sm font-normal leading-4 text-gray-400'>
                {fieldLabel}
              </Listbox.Label>
            )}
            <div className='relative mt-2'>
              <Listbox.Button
                className={cx(
                  'relative w-full cursor-default rounded-2xl',
                  'bg-slate-900 py-2 pl-4 pr-12 text-left text-white',
                  'text-base leading-6 ring-1 ring-inset ring-gray-500',
                  'focus:outline-none focus:ring-1 focus:ring-gray-400 '
                )}
              >
                <span className='flex items-center'>
                  <Image
                    src={selected.icon}
                    className='h-38 w-38'
                    alt=''
                    role='presentation'
                  />
                  <span className='ml-3 block truncate'>{selected.label}</span>
                </span>
                <span className='pointer-events-none absolute inset-y-0 right-0 ml-2 flex items-center pr-4'>
                  <IoIosArrowDown
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Listbox.Options
                  className={cx(
                    'rounded-lg bg-background-light shadow-[0_5px_50px_-12px_rgb(0,0,0,.25)] dark:shadow-[0_5px_50px_-12px_rgb(0,0,0)]',
                    'absolute z-10 mt-1 max-h-56 w-full overflow-auto',
                    'p-1.5 text-base shadow-lg',
                    'ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'
                  )}
                >
                  {items.map((item, i) => (
                    <Listbox.Option
                      key={i}
                      className={() =>
                        cx(
                          'relative flex items-center rounded-lg text-white outline-none transition-colors',
                          'gap-4 px-3 py-2 hover:bg-background-lighter focus:bg-background-lighter'
                        )
                      }
                      value={item}
                    >
                      {() => (
                        <>
                          <div className='flex items-center'>
                            <Image
                              src={item.icon}
                              className='h-38 w-38'
                              alt=''
                              role='presentation'
                            />
                            <span className={cx('ml-3 block truncate')}>
                              {item.label}
                            </span>
                          </div>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
