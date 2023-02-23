import { cx } from '@/utils/className'
import { ComponentProps } from 'react'
import { MdOutlineContentCopy } from 'react-icons/md'
import Button from './Button'

export type CopyTextProps = ComponentProps<'div'> & {
  text: string
}

export default function CopyText({ text, ...props }: CopyTextProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div {...props} className={cx('flex items-center', props.className)}>
      <span>{text}</span>
      <Button
        variant='transparent'
        className='ml-2 p-0'
        onClick={copyToClipboard}
      >
        <MdOutlineContentCopy />
      </Button>
    </div>
  )
}
