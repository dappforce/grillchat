import { useConfigContext } from '@/contexts/ConfigContext'
import useGetTheme from '@/hooks/useGetTheme'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { HiMoon, HiSun } from 'react-icons/hi2'
import Button, { ButtonProps } from './Button'

export type ColorModeTogglerProps = ButtonProps

export default function ColorModeToggler({ ...props }: ColorModeTogglerProps) {
  const { setTheme } = useTheme()
  const theme = useGetTheme()
  const [mounted, setMounted] = useState(false)
  const { theme: themeInConfig } = useConfigContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || themeInConfig) return null

  const handleClick = (e: any) => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
    props.onClick?.(e)
  }

  return (
    <Button
      size='circle'
      variant='transparent'
      {...props}
      onClick={handleClick}
    >
      {theme === 'dark' ? <HiSun /> : <HiMoon />}
    </Button>
  )
}
