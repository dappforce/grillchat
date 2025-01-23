import NoResultImage from '@/assets/graphics/no-result.png'
import Image from 'next/image'
import Container from './Container'

type NoDataProps = {
  message?: string
  button?: React.ReactNode
}

const NoData = ({ message, button }: NoDataProps) => {
  return (
    <Container
      as='div'
      className='mb-8 mt-12 flex !max-w-lg flex-col items-center justify-center gap-4 text-center md:mt-20'
    >
      <Image
        src={NoResultImage}
        className='h-48 w-48'
        alt=''
        role='presentation'
      />
      <p className='text-lg text-text-muted'>{message}</p>
      {button}
    </Container>
  )
}

export default NoData
