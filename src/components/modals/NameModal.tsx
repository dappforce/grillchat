import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import FormButton from '../FormButton'
import Input from '../inputs/Input'
import Modal, { ModalFunctionalityProps, ModalProps } from './Modal'

export type NameModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick' | 'title'> & {
    cancelButtonText?: string
  }

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
})
type FormSchema = z.infer<typeof formSchema>

export default function NameModal({ title, ...props }: NameModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = handleSubmit((data) => {
    console.log(data)
  })

  return (
    <Modal
      {...props}
      title={title || '🎩 Change my name'}
      description='Let other people know who you are. You can change it in any time.'
    >
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        <Input
          placeholder='Name (3-25 symbols)'
          {...register('name')}
          error={errors.name?.message}
        />
        <FormButton
          schema={formSchema}
          watch={watch}
          // isLoading={isLoading}
          // disabled={isImageLoading}
          // loadingText={isUpdating ? 'Saving...' : 'Creating...'}
          size='lg'
        >
          Save
        </FormButton>
      </form>
    </Modal>
  )
}
