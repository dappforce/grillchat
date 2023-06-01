import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import { HiArrowUpRight } from 'react-icons/hi2'
import { CopyTextInline } from './CopyText'
import LinkText from './LinkText'

type Data = {
  title: string
  content: string | undefined
  withCopyButton?: boolean
  redirectTo?: string
  openInNewTab?: boolean
}
export type DataCardProps = ComponentProps<'div'> & {
  data: Data[]
}

export default function DataCard({ data, ...props }: DataCardProps) {
  return (
    <div
      {...props}
      className={cx(
        'flex w-full flex-col gap-3 rounded-2xl bg-background-lighter px-4 py-4',
        props.className
      )}
    >
      {data.map((currentData) => {
        const { content, title, withCopyButton } = currentData
        if (!content) return null

        const containerClassName = cx(
          'border-b border-background-lightest pb-3 last:border-none last:pb-0'
        )

        const element = (
          <div
            key={title}
            className={cx('flex flex-1 flex-col gap-0.5 overflow-hidden')}
          >
            <span className='text-sm text-text-muted'>{title}</span>
            <Content {...currentData} />
          </div>
        )

        return (
          <div
            key={title}
            className={cx('flex w-full items-center', containerClassName)}
          >
            {withCopyButton ? (
              <div className={cx('flex w-full items-center')}>
                {element}
                <div className='ml-2'>
                  <CopyTextInline
                    textClassName='flex-1'
                    className='w-full'
                    textContainerClassName='w-full'
                    text={''}
                    textToCopy={content}
                  />
                </div>
              </div>
            ) : (
              element
            )}
          </div>
        )
      })}
    </div>
  )
}

function Content({ content, openInNewTab, redirectTo, withCopyButton }: Data) {
  const textClassName = cx('whitespace-pre-wrap break-words')

  if (!content) return null

  if (redirectTo) {
    return (
      <LinkText
        variant='secondary'
        href={redirectTo}
        openInNewTab={openInNewTab}
        className={textClassName}
      >
        {content}
        {openInNewTab && (
          <HiArrowUpRight className='relative -top-px ml-1 inline text-sm text-text-secondary/70' />
        )}
      </LinkText>
    )
  } else if (withCopyButton) {
    return (
      <CopyTextInline
        text={content}
        withButton={false}
        className={cx('text-text-secondary', textClassName)}
      />
    )
  }

  return <span className={textClassName}>{content}</span>
}
