import { getAugmentedAmpId } from '@/providers/config/utils'
import { createInstance } from '@amplitude/analytics-browser'

export async function createAmplitudeInstance() {
  if (typeof window === 'undefined') return null
  const ampId = getAugmentedAmpId()
  if (!ampId) return null

  try {
    const amp = createInstance()
    await amp.init(ampId, undefined, { identityStorage: 'localStorage' })
      .promise
    return amp
  } catch (e) {
    console.error('Error initializing amplitude', e)
    return null
  }
}
