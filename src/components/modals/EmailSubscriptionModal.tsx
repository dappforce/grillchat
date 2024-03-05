import useToastError from '@/hooks/useToastError'
import { useSubscribeWithEmail } from '@/services/subsocial-offchain/mutation'
import { useMyAccount } from '@/stores/my-account'
import { cx } from '@/utils/class-names'
import { LocalStorage } from '@/utils/storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import AutofocusWrapper from '../AutofocusWrapper'
import FormButton from '../FormButton'
import Input from '../inputs/Input'
import Modal, { ModalFunctionalityProps } from './Modal'

const SUBSCRIBED_STORAGE_KEY = 'email_subscribed'
export const emailSubscribedStorage = new LocalStorage(
  () => SUBSCRIBED_STORAGE_KEY
)

export type EmailSubscriptionModalProps = ModalFunctionalityProps & {
  onSuccess?: () => void
}

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})
type FormSchema = z.infer<typeof formSchema>

export default function EmailSubscriptionModal({
  onSuccess,
  ...props
}: EmailSubscriptionModalProps) {
  const parentProxyAddress = useMyAccount((state) => state.parentProxyAddress)

  const {
    mutate: subscribeWithEmail,
    error,
    isLoading,
  } = useSubscribeWithEmail({
    onSuccess: () => {
      onSuccess?.()
      props.closeModal()
      emailSubscribedStorage.set('true')
    },
  })
  useToastError(error, 'Failed to subscribe to newsletter')

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  return (
    <Modal
      {...props}
      title='✉️ Subscribe to Our Newsletter'
      description='Receive up to date info regarding GrillApp'
    >
      <form
        onSubmit={handleSubmit((data) => {
          if (!parentProxyAddress) return
          subscribeWithEmail({ address: parentProxyAddress, email: data.email })
        })}
        className={cx('flex flex-col gap-4')}
      >
        <AutofocusWrapper>
          {({ ref }) => (
            <Input
              {...register('email')}
              ref={(e) => {
                register('email').ref(e)
                ref.current = e
              }}
              disabled={isLoading}
              placeholder='Email address'
              error={errors.email?.message}
              variant='fill-bg'
            />
          )}
        </AutofocusWrapper>

        <FormButton
          schema={formSchema}
          watch={watch}
          isLoading={isLoading}
          size='lg'
        >
          Subscribe
        </FormButton>
      </form>
    </Modal>
  )
}
