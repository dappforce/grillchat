import React, { ComponentProps, useEffect } from 'react'
import { cx } from '../../utils/class-names'

type RangeInputProps = ComponentProps<'input'> & {
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
  rerenderTrigger?: any[]
}

const RangeInput = ({
  value,
  setValue,
  min,
  max,
  rangeLabels,
  valueLabel,
  rerenderTrigger,
  ...props
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

        const currentLabelHeight = currentLabelRef.current.offsetHeight

        var left = (value / max) * (inputWidth - width)

        currentLabelRef.current.style.top = -currentLabelHeight - 8 + 'px'
        currentLabelRef.current.style.left = left + 'px'
      }
    }
  }, [
    currentLabelRef.current?.offsetWidth,
    max,
    min,
    value,
    JSON.stringify(rerenderTrigger),
  ])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(e.target.value))
  }

  const moveLabel = (e: MouseEvent) => {
    if (currentLabelRef.current && inputRef.current) {
      const sliderMaxPosition =
        inputRef.current.offsetWidth - currentLabelRef.current.offsetWidth

      let newLeft =
        e.clientX -
        inputRef.current.getBoundingClientRect().left -
        currentLabelRef.current.offsetWidth / 2

      if (newLeft < 0) {
        newLeft = 0
      }

      if (newLeft > sliderMaxPosition) {
        newLeft = sliderMaxPosition
      }

      const value = min + (max - min) * (newLeft / sliderMaxPosition)
      document.body.classList.add('unselectable-text')
      setValue(value)
    }

    document.addEventListener('mouseup', closeDragElement)
  }

  const closeDragElement = () => {
    document.removeEventListener('mouseup', closeDragElement)
    document.removeEventListener('mousemove', moveLabel)
    document.body.classList.remove('unselectable-text')
  }

  const onMouseDown = () => {
    document.addEventListener('mousemove', moveLabel)
  }

  return (
    <div className='relative'>
      {valueLabel && (
        <div
          ref={currentLabelRef}
          className='absolute w-max cursor-ew-resize rounded-xl bg-background-primary px-2 py-[6px]'
          onMouseDown={onMouseDown}
        >
          {valueLabel}
        </div>
      )}
      <input
        ref={inputRef}
        type='range'
        value={value}
        step={1}
        onChange={onInputChange}
        min={min}
        max={max}
        className={cx('input-range w-full')}
        {...props}
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
