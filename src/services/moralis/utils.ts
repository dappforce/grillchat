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
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImMxMWI3MmZlLWQyZWItNDU1Zi05OTk1LWRmOTEyZDVhOWEwNiIsIm9yZ0lkIjoiMzQyMDI5IiwidXNlcklkIjoiMzUxNjEyIiwidHlwZUlkIjoiNmQ1OTdlZWYtODZjNi00MGIzLTlmMDMtM2Q4NGU1Y2Q1MzY0IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODYxNDQwNjksImV4cCI6NDg0MTkwNDA2OX0.0bakqeVJ15vsSM3C6q4g94cMJtzwBN64NqgE2Z2_M7w',
    })
    return moralis
  } catch (e) {
    console.error('Failed to initialize moralis API', e)
    return null
  }
}
