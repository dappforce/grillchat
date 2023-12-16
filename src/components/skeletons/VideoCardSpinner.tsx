import { fakeArray_2 } from '@/assets/constant'
export default function VideoCardSpinner() {
  return (
    <div className='w-full'>
      <div className='flex flex-wrap items-center justify-center gap-6   '>
        {fakeArray_2.map((item, i) => {
          return (
            <div
              className='flex-grow-2 flex  h-full  flex-shrink animate-pulse flex-col justify-center '
              key={i}
            >
              <div className='mx-auto  mb-1 h-[200px] rounded-xl bg-gray-300 dark:bg-gray-700 xs:w-screen  md:h-[170px] md:w-[270px] '></div>

              <div className='flex items-center gap-3  '>
                <div className='h-9 w-9 rounded-full bg-gray-300 dark:bg-gray-700 '></div>
                <div>
                  <div className='my-3 h-3.5 w-[160px] rounded-sm bg-gray-300 dark:bg-gray-700 '></div>

                  <div className='h-3 w-[130px] rounded-sm bg-gray-300 dark:bg-gray-700 '></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
