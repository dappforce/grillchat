import { getMoralisApiKey } from '@/utils/env/server'
import type Moralis from 'moralis'

let moralis: Promise<typeof Moralis | null> | null = null

export function getMoralisApi() {
  if (moralis) return moralis
  moralis = initMoralisApi()
  return moralis
}

async function initMoralisApi() {
  const { default: moralis } = await import('moralis')
  try {
    await moralis.start({
      apiKey: getMoralisApiKey(),
    })
  } catch (e) {
    console.error('Failed to initialize moralis API', e)
  }
  return moralis
}
