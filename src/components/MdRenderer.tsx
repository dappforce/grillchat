import { cx } from '@/utils/class-names'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import LinkText from './LinkText'

interface Props {
  source?: string
  className?: string
  removeEmptyParagraph?: boolean
  plain?: boolean
}

export default function MdRenderer({
  source,
  removeEmptyParagraph = false,
  className = '',
  plain = false,
}: Props) {
  const parsed = (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        a: (props) => (
          // @ts-expect-error - the props type is not correctly inferred
          <LinkText {...props} openInNewTab variant='secondary' />
        ),
        img: (props) => (
          // @ts-expect-error - the props type is not correctly inferred
          <Image alt='' className='bg-background-lighter' {...props} />
        ),
        p: (props) => {
          if (!removeEmptyParagraph) return <p {...props} />

          if (!props.children) return null
          if (typeof props.children === 'string' && !props.children.trim())
            return null
          return <p {...props} />
        },
      }}
    >
      {source}
    </ReactMarkdown>
  )
  if (plain) {
    return parsed
  }
  return (
    <div className={cx('prose max-w-full dark:prose-invert', className)}>
      {parsed}
    </div>
  )
}
