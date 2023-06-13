import useGetTheme from '@/hooks/useGetTheme'
import { useConfigContext } from '@/providers/ConfigProvider'
import { cx } from '@/utils/class-names'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2'
import Button, { ButtonProps } from './Button'

export type ColorModeTogglerProps = ButtonProps

export default function ColorModeToggler({ ...props }: ColorModeTogglerProps) {
  const { setTheme } = useTheme()
  const theme = useGetTheme()
  const [mounted, setMounted] = useState(false)
  const { theme: configTheme } = useConfigContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || configTheme) return null

  const handleClick = (e: any) => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    props.onClick?.(e)
  }

  return (
    <Button
      size='circle'
      variant='transparent'
      {...props}
      className={cx('text-xl', props.className)}
      onClick={handleClick}
    >
      {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
    </Button>
  )
}
