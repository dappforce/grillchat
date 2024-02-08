import { useState } from 'react'

const RangeInput = () => {
  const [value, setValue] = useState(1000)

  return (
    <div className='relative mb-6'>
      <input
        type='range'
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        min='100'
        max='1500'
        className='h-2 w-full cursor-pointer rounded-lg bg-gray-200 dark:bg-gray-700'
      />
      <div className='flex justify-between text-sm text-gray-500 dark:text-gray-400'>
        <span>Min ($100)</span>
        <span>$500</span>
        <span>Max ($1500)</span>
      </div>
    </div>
  )
}

export default RangeInput
