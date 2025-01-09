import clsx from 'clsx'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  source?: string
  className?: string
  omitDefaultClassName?: boolean
  withSmallerParagraphMargin?: boolean
}

export const DfMd = ({
  source,
  omitDefaultClassName,
  withSmallerParagraphMargin,
  className = '',
}: Props) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    className={clsx(
      !omitDefaultClassName && 'markdown-body',
      withSmallerParagraphMargin && 'markdown-body-smaller-p-margin',
      className
    )}
    components={{
      // @ts-expect-error - the props type is not correctly inferred
      img: (props) => <Image alt={props.alt || ''} {...props} />,
    }}
  >
    {source?.replaceAll(
      '(https://app.subsocial.network/ipfs',
      '(https://ipfs.subsocial.network'
    ) ?? ''}
  </ReactMarkdown>
)
