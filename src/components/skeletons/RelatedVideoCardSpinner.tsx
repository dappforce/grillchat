import { fakeArray_2 } from '@/assets/constant'

export default function RelatedVideoLosderSkelton() {
  return (
    <div className='xs:hidden xl:block'>
      {fakeArray_2.map((item, i) => {
        return (
          <div
            className='mb-3   flex animate-pulse items-center gap-2 '
            key={i}
          >
            <div className='h-[90px] w-[150px] rounded-md bg-gray-300 dark:bg-gray-700'></div>
            <div>
              <div className='mb-3 h-[8px] w-[120px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>
              <div className='h-[6px] w-[100px] rounded-lg bg-gray-300 dark:bg-gray-700'></div>

              <div className='mt-3 flex gap-2'>
                <div className='h-[5px] w-[30px] rounded-md bg-gray-300 dark:bg-gray-700'></div>
                <div className='h-[5px] w-[50px] rounded-md bg-gray-300 dark:bg-gray-700'></div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
