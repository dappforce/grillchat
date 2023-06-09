import { getMoralisApiKey } from '@/utils/env/client'
import type Moralis from 'moralis'

let moralis: Promise<typeof Moralis | null> | null = null

export function getMoralisApi() {
  if (moralis) return moralis
  moralis = initMoralisApi()
  return moralis
}

async function initMoralisApi() {
  try {
    const { default: moralis } = await import('moralis')
    await moralis.start({
      apiKey: getMoralisApiKey(),
    })
    return moralis
  } catch (e) {
    console.error('Failed to initialize moralis API', e)
    return null
  }
}
