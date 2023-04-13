import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export function generateRandomName(seed: string) {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    seed,
    style: 'capital',
  })
}
