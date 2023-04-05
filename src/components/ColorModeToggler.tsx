import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { HiMoon, HiSun } from 'react-icons/hi2'
import Button, { ButtonProps } from './Button'

export type ColorModeTogglerProps = ButtonProps

export default function ColorModeToggler({ ...props }: ColorModeTogglerProps) {
  const { systemTheme, theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  const handleClick = (e: any) => {
    setTheme(isDark ? 'light' : 'dark')
    props.onClick?.(e)
  }

  return (
    <Button
      size='circle'
      variant='transparent'
      {...props}
      onClick={handleClick}
    >
      {isDark ? <HiMoon /> : <HiSun />}
    </Button>
  )
}
