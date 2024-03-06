import { cx } from '@/utils/class-names'
import React, { useEffect, useState } from 'react'
import { FaAngleRight } from 'react-icons/fa6'
import { mutedTextColorStyles } from './content-staking/utils/commonStyles'

type AccordionItemProps = {
  title: string
  content: React.ReactNode
  onClick?: () => void
  isLastItem?: boolean
}

type AccordionProps = {
  items: AccordionItemProps[]
  className?: string
  onClick?: () => void
}

const Accordion = ({ items, className }: AccordionProps) => {
  return (
    <div className={cx('flex flex-col gap-6', className)}>
      {items.map((item, index) => (
        <AccordionItem key={index} isLastItem={index === items.length - 1} {...item} />
      ))}
    </div>
  )
}

const AccordionItem = ({ title, content, onClick, isLastItem }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const onItemClick = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    if (isOpen) {
      onClick?.()
    }
  }, [isOpen])

  return (
    <div className='flex flex-col'>
      <div
        onClick={() => onItemClick()}
        className='flex cursor-pointer items-center gap-2 text-lg font-medium leading-none text-text md:text-xl'
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
          'transition-accordion-height duration-300 ease-out',
          { [`${isLastItem ? '' : 'mb-2'} mt-4 grid-rows-1`]: isOpen, ['grid-rows-0']: !isOpen },
          mutedTextColorStyles
        )}
      >
        {content}
      </div>
    </div>
  )
}

export default Accordion
