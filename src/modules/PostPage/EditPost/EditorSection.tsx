import Input from '@/components/inputs/Input'

type EditorSectionProps = {
  register: any
  isLoading: boolean
  errors: any
}

const EditorSection = ({ register, isLoading, errors }: EditorSectionProps) => {
  return (
    <div>
      <Input
        {...register('title')}
        ref={(e) => {
          register('title').ref(e)
        }}
        disabled={isLoading}
        placeholder='Space Name'
        error={errors.title?.message}
        variant='fill-bg'
      />
    </div>
  )
}

export default EditorSection
