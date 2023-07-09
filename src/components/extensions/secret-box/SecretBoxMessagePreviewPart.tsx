import useGetTheme from '@/hooks/useGetTheme'
import { cx } from '@/utils/class-names'
import { RepliedMessagePreviewPartProps } from '../types'

const SecretBoxMessagePreviewPart = ({}: RepliedMessagePreviewPartProps) => {
  const theme = useGetTheme()

  return (
    <span>
      <div
        className={cx(
          theme === 'dark'
            ? 'bg-[#6660DF] text-white'
            : 'bg-[#E0E7FF] text-black',
          'w-max rounded-2xl px-3 py-[0.15rem]'
        )}
      >
        📦 Secret message
      </div>
    </span>
  )
}

export default SecretBoxMessagePreviewPart
