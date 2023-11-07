import uniqolor from 'uniqolor'

export function generateRandomColor(
  seed: string | undefined | null,
  currentTheme: 'light' | 'dark' = 'dark'
) {
  return uniqolor(seed ?? Math.random(), {
    lightness: currentTheme === 'light' ? [0, 50] : [50, 100],
  }).color
}
