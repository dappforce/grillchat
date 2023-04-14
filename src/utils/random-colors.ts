import randomColor from 'randomcolor'

export function generateRandomColor(seed: string | undefined | null) {
  return randomColor({
    seed: seed ?? undefined,
    luminosity: 'light',
  })
}
