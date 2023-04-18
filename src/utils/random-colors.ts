import randomColor from 'randomcolor'

export function generateRandomColor(
  seed: string | undefined | null,
  currentTheme?: 'light' | 'dark'
) {
  return randomColor({
    seed: seed ?? undefined,
    luminosity: currentTheme === 'dark' ? 'light' : 'dark',
  })
}
