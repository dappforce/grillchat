import { LocalStorage } from '@/utils/storage'

export const tappedPointsStorage = new LocalStorage(() => 'tapped-points')
export const tappedPointsSavedStorage = new LocalStorage(
  () => 'tapped-points-saved'
)

export const energyStorage = new LocalStorage(() => 'tapping-energy')

type TappedPoints = {
  tappedPoints: string
}

export const getTappedPointsStateStore = () => {
  const data = tappedPointsStorage.get()

  const parsedData = data ? JSON.parse(data) : undefined

  return parsedData as TappedPoints | undefined
}

export const setTappedPointsStateToStore = (value: Partial<TappedPoints>) => {
  const storedTappedPoints = getTappedPointsStateStore()

  const newTappedPoints = {
    ...storedTappedPoints,
    ...value,
  }

  tappedPointsStorage.set(JSON.stringify(newTappedPoints))
}

type Energy = {
  energyValue: string
  timestamp: string
  sendStatus: 'pending' | 'success' | 'error'
}

export const getEnergyStateStore = () => {
  const data = energyStorage.get()

  const parsedData = data ? JSON.parse(data) : undefined

  return parsedData as Energy | undefined
}

export const setEnergyStateToStore = (value: Partial<Energy>) => {
  const storedEnergy = getEnergyStateStore()

  const newEnergy = {
    ...storedEnergy,
    ...value,
  }

  energyStorage.set(JSON.stringify(newEnergy))
}
