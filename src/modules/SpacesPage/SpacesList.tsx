import Button from '@/components/Button'
import SpacePreview from '../SpacePage/SpacePreview'

type SpacesListProps = {
  spaceIds: string[]
}

const SpacesList = ({ spaceIds }: SpacesListProps) => {
  console.log(spaceIds)

  return (
    <div className='flex flex-col gap-3 px-4 pt-6'>
      <div className='flex items-center justify-between gap-4 border-b border-[#d1d1d1] pb-3'>
        <span className='mb-0 text-2xl font-medium'>My spaces</span>
        <Button variant={'primaryOutline'} href={'/spaces/new'} size={'md'}>
          Create space
        </Button>
      </div>
      <div className='flex w-full flex-1 flex-row gap-4'>
        {spaceIds.map((spaceId) => {
          return <SpacePreview key={spaceId} spaceId={spaceId} />
        })}
      </div>
    </div>
  )
}

export default SpacesList
