import FormButton from '@/components/FormButton'
import { MenuListProps } from '@/components/MenuList'
import SpaceAvatar from '@/components/SpaceAvatar'
import FloatingMenus from '@/components/floating/FloatingMenus'
import Input from '@/components/inputs/Input'
import { TagsInput } from '@/components/inputs/TagInput'
import {
  getSpaceByOwnerQuery,
  getSpaceQuery,
} from '@/services/datahub/spaces/query'
import { useMyMainAddress } from '@/stores/my-account'
import { SpaceData } from '@subsocial/api/types'
import { isDef } from '@subsocial/utils'
import { useEffect, useState } from 'react'
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form'
import { IoIosArrowDown } from 'react-icons/io'
import { ZodTypeAny } from 'zod'
import { FormSchema } from '..'

type PostParamsSectionProps = {
  formSchema: ZodTypeAny
  watch: UseFormWatch<FormSchema>
  register: any
  setValue: UseFormSetValue<FormSchema>
  control: Control<FormSchema>
  isLoading: boolean
  isUpdating: boolean
  spaceId: string
  errors: any
}
const PostParamsSection = (props: PostParamsSectionProps) => {
  return (
    <div className='flex h-fit flex-1 flex-col gap-4'>
      <SelectSpaceSection {...props} />
      <PostAdditionalFields {...props} />
    </div>
  )
}

const SelectSpaceSection = (props: PostParamsSectionProps) => {
  const { formSchema, watch, isUpdating, isLoading, setValue, spaceId } = props
  const myAddress = useMyMainAddress()
  const { data: defaultSpace } = getSpaceQuery.useQuery(spaceId || '')
  const { data: spaces } = getSpaceByOwnerQuery.useQuery(myAddress || '')
  const [selectedSpace, setSelectedSpace] = useState<SpaceData | null>(
    spaces?.[0] || null
  )

  const actionText = isUpdating ? 'Save changes' : 'Create'

  useEffect(() => {
    if (spaceId && defaultSpace) {
      setSelectedSpace(defaultSpace)
    }
  }, [spaceId, defaultSpace])

  useEffect(() => {
    setSelectedSpace(spaces?.[0] || null)
    setValue('spaceId', spaces?.[0]?.id || '')
  }, [spaces?.length])

  const menuItems =
    spaces
      ?.map((space) => ({
        text: (
          <div className='flex items-center gap-3'>
            <SpaceAvatar space={space} className='h-[32px] w-[32px]' />
            <span>{space?.content?.name || 'Select space'}</span>
          </div>
        ),
        onClick: () => {
          setSelectedSpace(space)
          setValue('spaceId', space.id)
        },
      }))
      .filter(isDef) || ([] as MenuListProps['menus'])

  if (!spaces) return null

  return (
    <div className='flex h-fit flex-1 flex-col gap-4 rounded-lg bg-white p-4'>
      <FloatingMenus
        menus={menuItems}
        allowedPlacements={['bottom-start']}
        mainAxisOffset={4}
        panelSize='xs'
      >
        {(config) => {
          const { referenceProps, toggleDisplay } = config || {}
          if (!selectedSpace) return <></>

          return (
            <div
              {...referenceProps}
              onClick={toggleDisplay}
              className='flex cursor-pointer items-center justify-between gap-1 text-text-primary'
            >
              <div className='flex items-center gap-3'>
                <SpaceAvatar
                  space={selectedSpace}
                  className='h-[32px] w-[32px]'
                />
                <span>{selectedSpace?.content?.name || 'Select space'}</span>
              </div>
              <IoIosArrowDown className='text-text-muted' />
            </div>
          )
        }}
      </FloatingMenus>
      <FormButton
        schema={formSchema}
        watch={watch}
        isLoading={isLoading}
        loadingText={isLoading ? 'Loading...' : undefined}
        size='lg'
      >
        {actionText}
      </FormButton>
    </div>
  )
}

const PostAdditionalFields = (props: PostParamsSectionProps) => {
  const { register, isLoading, errors, watch, setValue } = props
  return (
    <div className='flex h-fit flex-1 flex-col gap-4 rounded-lg bg-white p-4'>
      <div className='flex flex-col gap-2'>
        <span>Tags</span>
        <TagsInput
          placeholder={"Press 'Enter' or 'Tab' key to add tags"}
          disabled={isLoading}
          value={watch('tags')}
          onChange={(tags) => setValue('tags', tags)}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <span>Original URL</span>
        <Input
          {...register('originalUrl')}
          ref={(e) => {
            register('tags').ref(e)
          }}
          disabled={isLoading}
          placeholder='URL of the original post'
          error={errors.title?.message}
          variant='outlined'
        />
        <span className='text-text-muted'>
          This is the original URL of the place you first posted about this on
          another social media platform (i.e. Medium, Reddit, Twitter, etc.)
        </span>
      </div>
    </div>
  )
}

export default PostParamsSection
