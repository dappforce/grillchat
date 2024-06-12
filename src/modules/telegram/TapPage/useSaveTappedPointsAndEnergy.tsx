import { useSavePointsAndEnergy } from '@/services/datahub/leaderboard/points-balance/mutation'
import { increasePointsBalance } from '@/services/datahub/leaderboard/points-balance/optimistic'
import {
  FULL_ENERGY_VALUE,
  getBalanceQuery,
  getClickedPointsByDayQuery,
} from '@/services/datahub/leaderboard/points-balance/query'
import { useMyMainAddress } from '@/stores/my-account'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import {
  energyStorage,
  getEnergyState,
  getTappedPointsState,
  setEnergyState,
  setTappedPointsState,
  tappedPointsStorage,
} from './store'

const useSaveTappedPointsAndEnergy = () => {
  const myAddress = useMyMainAddress()
  const [processingPrevData, setProcessingPrevData] = useState(true)

  const { data: clickedPointsByDay } = getClickedPointsByDayQuery.useQuery(
    myAddress || ''
  )
  const client = useQueryClient()

  const { mutateAsync: saveData } = useSavePointsAndEnergy()

  useEffect(() => {
    const updateData = async () => {
      if (clickedPointsByDay && myAddress) {
        const tappedPoints = getTappedPointsState()

        if (tappedPoints?.sendStatus === 'success') {
          tappedPointsStorage.remove()
          energyStorage.remove()
        } else {
          const { sendStatus } = await updatePointsAndEnergy()

          if (sendStatus === 'success' && tappedPoints?.tappedPoints) {
            increasePointsBalance({
              pointsByClick: parseInt(tappedPoints.tappedPoints),
              address: myAddress,
              client,
            })

            getClickedPointsByDayQuery.setQueryData(client, myAddress, {
              tapsCount:
                clickedPointsByDay.tapsCount +
                parseInt(tappedPoints.tappedPoints),
              date: clickedPointsByDay.date,
            })

            await getBalanceQuery.invalidate(client, myAddress)
            await getClickedPointsByDayQuery.invalidate(client, myAddress)
            tappedPointsStorage.remove()
            energyStorage.remove()
          }
        }
        setProcessingPrevData(false)
      }
    }

    updateData()
  }, [clickedPointsByDay, client, myAddress])

  const updatePointsAndEnergy = useMemo(
    () => async () => {
      const tapsCountByDay = clickedPointsByDay?.tapsCount || 0
      const tappedPoints = getTappedPointsState()
      const energyState = getEnergyState()

      if (!tappedPoints || !energyState) return {}

      const energyValue = energyState.energyValue

      if (
        (tappedPoints.tappedPoints === '0' ||
          tappedPoints.sendStatus === 'success') &&
        parseInt(energyValue) === FULL_ENERGY_VALUE
      )
        return {}

      const taps = tapsCountByDay + parseInt(tappedPoints.tappedPoints)

      try {
        await saveData({
          energyState: {
            value: parseInt(energyValue),
            timestamp: energyState.timestamp,
          },
          tapsState: {
            tapsCount: taps,
          },
        })

        setTappedPointsState({
          sendStatus: 'success',
        })
        setEnergyState({
          sendStatus: 'success',
        })
        console.info(
          `Tapped points (${taps}) and energy (${energyValue}) saved!`
        )

        return { sendStatus: 'success' }
      } catch (e) {
        console.error('Error saving tapped points and energy', e)

        setTappedPointsState({
          sendStatus: 'error',
        })

        setEnergyState({
          sendStatus: 'error',
        })

        return { sendStatus: 'error' }
      }
    },
    [clickedPointsByDay?.tapsCount, processingPrevData]
  )

  useEffect(() => {
    if (!clickedPointsByDay && processingPrevData) return

    const interval = setInterval(updatePointsAndEnergy, 10000)

    return () => {
      console.log('Clearing interval for saving tapped points and energy')
      clearInterval(interval)
    }
  }, [clickedPointsByDay, processingPrevData])

  return {}
}

export default useSaveTappedPointsAndEnergy
