import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export function generateRandomName(seed: string | undefined | null) {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    seed: seed ?? undefined,
    style: 'capital',
  })
}
