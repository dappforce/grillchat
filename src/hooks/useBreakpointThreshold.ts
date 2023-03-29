import { useMemo } from 'react'
import tailwindConfig from 'tailwind.config'
import resolveConfig from 'tailwindcss/resolveConfig'
import { useBreakpoint } from 'use-breakpoint'

export const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'] as const

type BreakpointKeys = (typeof breakpoints)[number]

const config = resolveConfig(tailwindConfig)
const screens = Object.entries(config.theme?.screens ?? []).reduce<{
  [key in BreakpointKeys]: number
}>(
  (acc, [key, value]) => {
    const val = value + ''
    acc[key as unknown as BreakpointKeys] = +val.substring(0, val.length - 2)
    return acc
  },
  {
    sm: 0,
    md: 0,
    lg: 0,
    xl: 0,
    '2xl': 0,
  }
)

function useTailwindBreakpoint() {
  return useBreakpoint(screens, 'sm').breakpoint
}

/**
 * Determine if current vw (viewport width) larger than threshold. You have to handle case if returned first element returns undefined in SSR.
 * @param threshold breakpoint to become threshold
 * @returns boolean bool that determines if current vw is larger than threshold
 */
export default function useBreakpointThreshold(
  threshold: (typeof breakpoints)[number]
): boolean {
  const breakpoint = useTailwindBreakpoint()
  return useMemo(() => {
    const res: { thresholdIdx: number; breakpointIdx: number } = {
      thresholdIdx: 0,
      breakpointIdx: -1,
    }
    breakpoints.forEach((el, idx) => {
      if (el === breakpoint) res.breakpointIdx = idx
      if (el === threshold) res.thresholdIdx = idx
    })
    return res.thresholdIdx <= res.breakpointIdx
  }, [threshold, breakpoint])
}
