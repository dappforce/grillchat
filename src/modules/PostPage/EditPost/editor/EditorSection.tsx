import ImageInput from '@/components/inputs/ImageInput'
import Input from '@/components/inputs/Input'
import { cx } from '@/utils/class-names'
import { useState } from 'react'
import { Control, Controller, UseFormSetValue } from 'react-hook-form'
import { FormSchema } from '..'
import Tabs from '../../../../components/Tabs'
import { htmlToMd } from './HtmlEditor/tiptap'
import MdEditor from './MdEditor/client'

type EditorSectionProps = {
  register: any
  setValue: UseFormSetValue<FormSchema>
  control: Control<FormSchema>
  isLoading: boolean
  errors: any
}

const EditorSection = ({
  register,
  isLoading,
  errors,
  control,
  setValue,
}: EditorSectionProps) => {
  const tabs = [
    {
      id: 'cover-image',
      text: 'Cover Image',
      content: () => (
        <CoverImageContent
          register={register}
          isLoading={isLoading}
          setValue={setValue}
          control={control}
        />
      ),
    },
    {
      id: 'link',
      text: 'Link',
      content: () => <LinkContent />,
    },
  ]

  return (
    <div className='flex w-[65%] flex-col gap-4'>
      <div className='rounded-lg bg-white p-4'>
        <Input
          {...register('title')}
          ref={(e) => {
            register('title').ref(e)
          }}
          disabled={isLoading}
          placeholder='Title'
          error={errors.title?.message}
          variant='outlined'
          className='text-2xl ring-0 hover:ring-0 focus-visible:ring-0'
        />
        <Tabs
          className='max-w-full border-b border-border-gray bg-background-light px-0.5 text-sm md:bg-background-light/50'
          panelClassName='mt-0 px-0'
          tabClassName={cx('px-1.5 sm:px-2')}
          asContainer
          tabs={tabs}
          withHashIntegration={false}
          hideBeforeHashLoaded
        />
      </div>
      <EditorCard
        register={register}
        isLoading={isLoading}
        setValue={setValue}
        control={control}
        markdownMode={true}
        setMarkdownMode={() => {}}
      />
    </div>
  )
}

type EditorCardProps = {
  register: any
  isLoading: boolean
  setValue: UseFormSetValue<FormSchema>
  control: Control<FormSchema>
  markdownMode: boolean
  setMarkdownMode: (value: boolean) => void
}

const EditorCard = ({
  markdownMode,
  register,
  control,
  setValue,
  setMarkdownMode,
}: EditorCardProps) => {
  const [fixedToolbar, setFixedToolbar] = useState(false)

  const onChange = (value: string) => {
    setValue('body', value)
  }

  const toggleMarkdownMode = () => {
    const newState = !markdownMode
    setMarkdownMode(newState)
  }

  const onChangeHtmlEditor = (text: string) => {
    const mdText = htmlToMd(text) || ''
    onChange(mdText)
  }

  console.log('MdEditor')

  return (
    <div className='rounded-lg bg-white p-4'>
      <Controller
        control={control}
        name='image'
        render={({ field, fieldState }) => {
          return markdownMode ? (
            <MdEditor
              onChange={onChange}
              options={{ autofocus: true }}
              className={'BorderLessMdEditor'}
            />
          ) : (
            // <HtmlEditor
            //   onChange={onChangeHtmlEditor}
            //   saveBodyDraft={onChangeHtmlEditor}
            //   showToolbar
            // />
            <></>
          )
        }}
      />
    </div>
  )
}

type TabContentProps = {
  register: any
  isLoading: boolean
  setValue: UseFormSetValue<FormSchema>
  control: Control<FormSchema>
}

const CoverImageContent = ({
  register,
  isLoading,
  control,
  setValue,
}: TabContentProps) => {
  return (
    <Controller
      control={control}
      name='image'
      render={({ field, fieldState }) => {
        return (
          <ImageInput
            {...register('cover')}
            ref={(e) => {
              register('cover').ref(e)
            }}
            disabled={isLoading}
            image={field.value}
            innerLabel={
              <div className='flex flex-col items-center gap-1'>
                <span className='text-xl'>
                  <span className='font-semibold'>Drag & drop here</span> or{' '}
                  <span className='font-semibold'>click to upload</span>
                </span>
                <span className='text-text-muted'>
                  We recommend uploading an image with a pixel size of 1280 x
                  720 and less than 2 mb.
                </span>
              </div>
            }
            setImageUrl={(value) => setValue('image', value)}
            containerProps={{ className: 'my-2' }}
            dropzoneClassName='!h-[200px] !w-full rounded-lg gap-3 bg-background-light'
            error={fieldState.error?.message}
          />
        )
      }}
    />
  )
}

const LinkContent = () => {
  return <></>
}

export default EditorSection
