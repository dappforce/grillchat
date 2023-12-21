import { useConfigContext } from '@/providers/ConfigProvider'
import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'

export default function CenterChatNotice({
  isMyChat,
  ...props
}: ComponentProps<'div'> & { isMyChat: boolean }) {
  const { customTexts } = useConfigContext()

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col rounded-2xl bg-background-light/50 px-6 py-4 text-sm text-text-muted',
        props.className
      )}
    >
      {isMyChat ? (
        <>
          <div>
            <div className='flex flex-col items-center justify-center gap-2'>
              <img
                src='/img/no-comment.svg'
                className='h-[200px] w-[200px]'
                alt='no-comment'
              />
              <h1 className='font-bold'>
                No comment yet be the first one to comment!
              </h1>
            </div>
          </div>
        </>
      ) : (
        <div className='flex flex-col items-center justify-center gap-2'>
          <img
            src='/img/no-comment.svg'
            className='h-[200px] w-[200px]'
            alt='no-comment'
          />
          <h1 className='text-lg font-bold'>
            No comment yet be the first one to comment!
          </h1>
        </div>
      )}
    </div>
  )
}
