import React, { useEffect, useMemo } from 'react'
import { cx } from '../../utils/class-names'
type RangeInputProps = {
  value: number
  setValue: (value: number) => void
  min: number
  max: number
  valueLabel?: React.ReactNode
  rangeLabels?: {
    minLabel: React.ReactNode
    maxLabel: React.ReactNode
    middleLabel: React.ReactNode
  }
}

const RangeInput = ({
  value,
  setValue,
  min,
  max,
  rangeLabels,
  valueLabel,
}: RangeInputProps) => {
  const { minLabel, maxLabel, middleLabel } = rangeLabels || {}
  const currentLabelRef = React.useRef<HTMLInputElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)


  useEffect(() => {
    if (inputRef.current) {
      let percentage = ((value - min) * 100) / (max - min)

      inputRef.current.style.backgroundSize = percentage + '% 100%'

      if (currentLabelRef.current) {
        const inputWidth = inputRef.current.offsetWidth
        const width = currentLabelRef.current.offsetWidth
  
        var left = (value / max) * (inputWidth - width)
  
        currentLabelRef.current.style.left = left - 1 + 'px'
      }
    }
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let target = e.target
    const val = target.value
    let percentage = ((parseInt(val) - min) * 100) / (max - min)

    target.style.backgroundSize = percentage + '% 100%'

    if (currentLabelRef.current) {
      const inputWidth = target.offsetWidth
      const width = currentLabelRef.current.offsetWidth

      var left = (parseInt(val) / max) * (inputWidth - width)

      currentLabelRef.current.style.left = left - 1 + 'px'
    }

    setValue(Number(e.target.value))
  }

  return (
    <div className='relative'>
      {valueLabel && (
        <div
          ref={currentLabelRef}
          style={{ top: -((currentLabelRef.current?.offsetHeight || 0) + 8) }}
          className='absolute rounded-xl bg-indigo-600 px-2 py-[6px]'
        >
          {valueLabel}
        </div>
      )}
      <input
        ref={inputRef}
        type='range'
        value={value}
        onChange={onInputChange}
        min={min}
        max={max}
        className={cx('input-range w-full')}
      />
      <div className='relative flex justify-between text-sm text-text'>
        {minLabel}
        {middleLabel}
        {maxLabel}
      </div>
    </div>
  )
}

export default RangeInput
