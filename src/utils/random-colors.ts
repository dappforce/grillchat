import randomColor from 'randomcolor'

export function generateRandomColor(seed: string) {
  return randomColor({
    seed,
    luminosity: 'light',
  })
}
