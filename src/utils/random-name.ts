import crypto from 'crypto'
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator'

export function generateRandomName(seed: string | undefined | null) {
  let hashedSeed = seed
  if (seed) {
    const hashObj = crypto.createHash('sha512')
    hashedSeed = hashObj.update(seed).digest().toString('hex')
  }
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    seed: hashedSeed ?? undefined,
    style: 'capital',
  })
}
