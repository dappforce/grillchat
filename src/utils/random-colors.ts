import randomColor from 'randomcolor'

export function generateRandomColor(
  seed: string,
  currentTheme?: 'light' | 'dark'
) {
  return randomColor({
    seed,
    luminosity: currentTheme === 'dark' ? 'light' : 'dark',
  })
}
