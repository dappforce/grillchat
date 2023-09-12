import { getProfileQuery } from '@/services/api/query'
import { UpsertProfileWrapper } from '@/services/subsocial/profiles/mutation'
import { useMyAccount } from '@/stores/my-account'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { HiOutlineInformationCircle } from 'react-icons/hi2'
import { z } from 'zod'
import Button from '../Button'
import FormButton from '../FormButton'
import Input from '../inputs/Input'
import Toast from '../Toast'
import Modal, { ModalFunctionalityProps, ModalProps } from './Modal'

export type NameModalProps = ModalFunctionalityProps &
  Pick<ModalProps, 'onBackClick' | 'title'> & {
    cancelButtonText?: string
  }

const formSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(25, 'Name is too long'),
})
type FormSchema = z.infer<typeof formSchema>

export default function NameModal({
  title,
  cancelButtonText,
  ...props
}: NameModalProps) {
  const myAddress = useMyAccount((state) => state.address)
  const { data } = getProfileQuery.useQuery(myAddress ?? '', {
    enabled: !!myAddress,
  })
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    defaultValues: { name: data?.profileSpace?.name ?? '' },
    resolver: zodResolver(formSchema),
  })

  return (
    <Modal
      {...props}
      title={title || '🎩 Change my name'}
      description='Let other people know who you are. You can change it in any time.'
    >
      <UpsertProfileWrapper>
        {({ mutateAsync }) => {
          const onSubmit = handleSubmit((data) => {
            mutateAsync({ content: { name: data.name } })
            props.closeModal()
            toast.custom((t) => (
              <Toast
                t={t}
                title='Your username was set'
                icon={(className) => (
                  <HiOutlineInformationCircle className={className} />
                )}
              />
            ))
          })

          return (
            <form onSubmit={onSubmit} className='flex flex-col gap-4'>
              <Input
                placeholder='Name (3-25 symbols)'
                {...register('name')}
                error={errors.name?.message}
              />
              <FormButton schema={formSchema} watch={watch} size='lg'>
                Save
              </FormButton>
              {cancelButtonText && (
                <Button
                  onClick={() => props.closeModal()}
                  size='lg'
                  variant='primaryOutline'
                >
                  {cancelButtonText}
                </Button>
              )}
            </form>
          )
        }}
      </UpsertProfileWrapper>
    </Modal>
  )
}
