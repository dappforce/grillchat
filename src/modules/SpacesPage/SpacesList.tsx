import SpacePreview from '../SpacePage/SpacePreview'

type SpacesListProps = {
  spaceIds: string[]
}

const SpacesList = ({ spaceIds }: SpacesListProps) => {
  console.log(spaceIds)

  return (
    <div className='flex w-full flex-1 flex-row gap-4'>
      {spaceIds.map((spaceId) => {
        return <SpacePreview key={spaceId} spaceId={spaceId} />
      })}
    </div>
  )
}

export default SpacesList
