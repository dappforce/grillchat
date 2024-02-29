import { cx } from '@/utils/class-names'
import React, { useState } from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { mutedTextColorStyles } from './content-staking/utils/commonStyles'

type AccordionItemProps = {
  title: string
  content: React.ReactNode
}

type AccordionProps = {
  items: AccordionItemProps[]
  className?: string
}

const Accordion = ({ items, className }: AccordionProps) => {
  return (
    <div className={cx('flex flex-col gap-6', className)}>
      {items.map((item, index) => (
        <AccordionItem key={index} {...item} />
      ))}
    </div>
  )
}

const AccordionItem = ({ title, content }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='flex flex-col'>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='flex cursor-pointer items-center gap-2 md:text-xl text-lg font-medium leading-none text-text'
      >
        <FaAngleRight
          size={20}
          className={cx(
            {
              ['-rotate-90']: isOpen,
              ['rotate-0']: !isOpen,
            },
            'transition-transform duration-300 ease-out'
          )}
        />
        {title}
      </div>
      <div
        className={cx(
          'ml-[28px] grid overflow-hidden text-base font-normal leading-6',
          'transition-[grid-template-rows] duration-300 ease-out',
          { ['mb-2 mt-4 grid-rows-1']: isOpen, ['grid-rows-0']: !isOpen },
          mutedTextColorStyles
        )}
      >
        {content}
      </div>
    </div>
  )
}

export default Accordion
