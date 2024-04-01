import { cx } from '@/utils/class-names'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import LinkText from './LinkText'

interface Props {
  source?: string
  className?: string
}

export default function MdRenderer({ source, className = '' }: Props) {
  return (
    <div className={cx('prose max-w-full dark:prose-invert', className)}>
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
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
