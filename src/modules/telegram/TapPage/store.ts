import { LocalStorage } from '@/utils/storage'

export const tappedPointsStorage = new LocalStorage(() => 'tapped-points')

export const energyStorage = new LocalStorage(() => 'tapping-energy')

type TappedPoints = {
  tappedPoints: string
  sendStatus: 'pending' | 'success' | 'error'
}

export const getTappedPointsState = () => {
  const data = tappedPointsStorage.get()

  const parsedData = data ? JSON.parse(data) : undefined

  return parsedData as TappedPoints | undefined
}

export const setTappedPointsState = (value: Partial<TappedPoints>) => {
  const storedTappedPoints = getTappedPointsState()

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

export const getEnergyState = () => {
  const data = energyStorage.get()

  const parsedData = data ? JSON.parse(data) : undefined

  return parsedData as Energy | undefined
}

export const setEnergyState = (value: Partial<Energy>) => {
  const storedEnergy = getEnergyState()

  const newEnergy = {
    ...storedEnergy,
    ...value,
  }

  energyStorage.set(JSON.stringify(newEnergy))
}
