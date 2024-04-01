import { cx } from '@/utils/class-names'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LinkText from './LinkText'

interface Props {
  source?: string
  className?: string
}

export default function MdRenderer({ source, className = '' }: Props) {
  return (
    <div className={cx('prose dark:prose-invert', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // @ts-expect-error - the props type is not correctly inferred
          a: (props) => (
            <LinkText {...props} openInNewTab variant='secondary' />
          ),
          // @ts-expect-error - the props type is not correctly inferred
          img: (props) => <Image alt='' {...props} />,
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
