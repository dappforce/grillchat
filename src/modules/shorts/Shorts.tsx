import Image from 'next/image'
export default function Shorts() {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Image
        src={`/img/programmer.svg`}
        width={300}
        height={300}
        alt='programmer'
      />
      <h1 className='text-3xl font-bold'>Coming soon...!</h1>
    </div>
  )
}
