import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export function generateRandomName(seed: string | undefined | null) {
  const base64Seed = seed ? Buffer.from(seed).toString('base64') : undefined
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    seed: base64Seed,
    style: 'capital',
  })
}
