import Grill from '@/assets/logo/grill.svg'
import Button from '@/components/Button'
import Input from '@/components/inputs/Input'
import LinkText, { LinkTextProps } from '@/components/LinkText'
import Toast from '@/components/Toast'
import { useSubscribeInLanding } from '@/services/subsocial-offchain/mutation'
import { useSendEvent } from '@/stores/analytics'
import { cx } from '@/utils/class-names'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { BiLogoTelegram } from 'react-icons/bi'
import { RiDiscordFill, RiTwitterXLine } from 'react-icons/ri'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import HighlightedText from './common/HighlightedText'

export default function Footer(props: ComponentProps<'footer'>) {
  const sendEvent = useSendEvent()
  return (
    <footer
      className={cx(
        'relative mx-auto flex max-w-6xl flex-col gap-8 md:gap-14',
        props.className
      )}
    >
      <div className='hidden md:block'>
        <Grill className='relative -left-2 text-4xl' />
      </div>
      <div className='grid grid-cols-2 gap-4 text-base sm:grid-cols-3 sm:text-lg lg:grid-cols-[repeat(14,_minmax(0,_1fr))]'>
        <div className='flex flex-col gap-3 lg:col-span-3'>
          <HighlightedText
            size='sm'
            roundings='lg'
            rotate={3}
            className='max-w-max'
          >
            <LinkText
              href='/staking'
              onClick={() =>
                sendEvent('lp_start_earning', { eventSource: 'footer' })
              }
            >
              Start Earning
            </LinkText>
          </HighlightedText>
          <OpenInNewTabLink
            href='/discuss'
            onClick={() => sendEvent('lp_discuss_grill')}
          >
            Discuss Grill
          </OpenInNewTabLink>
          <OpenInNewTabLink
            href='https://docs.subsocial.network/docs/basics/content-staking/content-staking'
            onClick={() => sendEvent('lp_docs_clicked')}
          >
            Documentation
          </OpenInNewTabLink>
        </div>
        <div className='flex flex-col gap-3 lg:col-span-3'>
          <OpenInNewTabLink
            href='https://www.youtube.com/watch?v=Hggz8sEM2Wk&list=PL5WL9aalTKGwNwY94n8nz8TOd7JVdQdfF&index=2'
            onClick={() =>
              sendEvent('lp_get_sub', {
                value: 'mexc',
                eventSource: 'footer',
              })
            }
          >
            SUB on MEXC
          </OpenInNewTabLink>
          <OpenInNewTabLink
            href='https://www.youtube.com/watch?v=Gs0y3FECzro&list=PL5WL9aalTKGwNwY94n8nz8TOd7JVdQdfF'
            onClick={() =>
              sendEvent('lp_get_sub', {
                value: 'hydradx',
                eventSource: 'footer',
              })
            }
          >
            SUB on HydraDX
          </OpenInNewTabLink>
          <OpenInNewTabLink
            href='https://docs.subsocial.network/docs/tutorials/GetSUB/stellaswap'
            onClick={() =>
              sendEvent('lp_get_sub', {
                value: 'stellaswap',
                eventSource: 'footer',
              })
            }
          >
            SUB on StellaSwap
          </OpenInNewTabLink>
        </div>
        <div className='flex flex-col gap-3 lg:col-span-3'>
          <OpenInNewTabLink
            openInNewTab={false}
            onClick={(e) => {
              e.preventDefault()
              document
                .getElementById('how-to-earn')
                ?.scrollIntoView({ behavior: 'smooth' })
            }}
            style={{ scrollMarginTop: '64px' }}
            href='#how-to-earn'
          >
            How to Earn SUB
          </OpenInNewTabLink>
          <OpenInNewTabLink
            href='/staking'
            onClick={() =>
              sendEvent('lp_start_earning', { eventSource: 'footer-lock-sub' })
            }
          >
            Lock SUB
          </OpenInNewTabLink>
          <OpenInNewTabLink
            href='https://grillapp.net/leaderboard'
            onClick={() => sendEvent('lp_leaderboard_clicked')}
          >
            Leaderboard
          </OpenInNewTabLink>
        </div>
        <ParticipateCard className='col-span-2 mt-4 sm:col-span-3 sm:mt-4 lg:col-span-5 lg:mt-0' />
      </div>
      <div className='flex justify-between pb-16'>
        <span className='text-lg text-[#805B7B]'>© 2024 Grillapp.net</span>
        <div className='flex items-center gap-4 text-lg'>
          <Button
            size='noPadding'
            className='rounded-full bg-white/5 p-1.5'
            variant='transparent'
            href='https://twitter.com/SubsocialChain'
            target='_blank'
            rel='noreferrer noopener'
          >
            <RiTwitterXLine />
          </Button>
          <Button
            size='noPadding'
            className='rounded-full bg-white/10 p-1.5'
            variant='transparent'
            href='https://discord.gg/3a2JsRppXj'
            target='_blank'
            rel='noreferrer noopener'
          >
            <RiDiscordFill />
          </Button>
          <Button
            size='noPadding'
            className='rounded-full bg-white/10 p-1.5'
            variant='transparent'
            href='https://t.me/SubsocialNetwork'
            target='_blank'
            rel='noreferrer noopener'
          >
            <BiLogoTelegram className='relative -left-px' />
          </Button>
        </div>
      </div>
    </footer>
  )
}

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
})
type FormSchema = z.infer<typeof formSchema>
function ParticipateCard(props: ComponentProps<'div'>) {
  const sendEvent = useSendEvent()
  const { ref } = useInView({
    triggerOnce: true,
    onChange: (inView) => {
      if (inView) {
        sendEvent('lp_email_form_on_screen')
      }
    },
  })

  const { mutate, isLoading } = useSubscribeInLanding({
    onSuccess: () => {
      sendEvent('lp_email_from_sent')
      reset()
      toast.custom((t) => (
        <Toast
          t={t}
          type='default'
          icon={() => <span className='mr-1'>🎉</span>}
          title='Thanks for joining us! Exciting updates await in your inbox!'
        />
      ))
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (errors.email?.message) {
      toast.custom((t) => (
        <Toast t={t} type='error' title={errors.email?.message} />
      ))
    }
    handleSubmit((data) => {
      mutate({ email: data.email })
    })(e)
  }

  return (
    <div
      {...props}
      className={cx(
        'flex flex-col gap-3 rounded-3xl bg-white/5 p-4 pb-5 sm:p-5',
        props.className
      )}
      ref={ref}
    >
      <span className='text-center text-[#FEEFFB] sm:text-left'>
        Participate in future activities
      </span>
      <form className='relative' onSubmit={onSubmit}>
        <Input
          {...register('email')}
          disabled={isLoading}
          type='email'
          variant='fill-bg'
          placeholder='Your email'
          size='sm'
          onClick={() => sendEvent('lp_email_form_clicked')}
          className='bg-[#10182B] pr-12 ring-0'
        />
        <button
          type='submit'
          className='absolute right-4 top-1/2 -translate-y-1/2'
        >
          <svg width='18' height='15' viewBox='0 0 18 15' fill='none'>
            <path
              d='M1 6.5C0.447715 6.5 -4.82823e-08 6.94772 0 7.5C4.82823e-08 8.05228 0.447715 8.5 1 8.5L1 6.5ZM17.7071 8.20711C18.0976 7.81658 18.0976 7.18342 17.7071 6.79289L11.3431 0.428931C10.9526 0.0384069 10.3195 0.038407 9.92893 0.428931C9.53841 0.819456 9.53841 1.45262 9.92893 1.84315L15.5858 7.5L9.92893 13.1569C9.53841 13.5474 9.53841 14.1805 9.92893 14.5711C10.3195 14.9616 10.9526 14.9616 11.3431 14.5711L17.7071 8.20711ZM1 8.5L17 8.5L17 6.5L1 6.5L1 8.5Z'
              fill='white'
            />
          </svg>
        </button>
      </form>
    </div>
  )
}

function OpenInNewTabLink({ children, ...props }: LinkTextProps) {
  return (
    <LinkText
      {...props}
      className={cx('flex max-w-max items-center gap-2', props.className)}
      openInNewTab={props.openInNewTab ?? true}
    >
      <span className='inline-block'>{children}</span>
      <svg width='20' height='21' viewBox='0 0 20 21' fill='none'>
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M6.22279 5.15L14.3228 5.15C14.8198 5.15 15.2228 5.55294 15.2228 6.05L15.2228 14.15C15.2228 14.6471 14.8198 15.05 14.3228 15.05C13.8257 15.05 13.4228 14.6471 13.4228 14.15L13.4228 8.22279L5.95919 15.6864C5.60772 16.0379 5.03787 16.0379 4.6864 15.6864C4.33492 15.3349 4.33492 14.7651 4.6864 14.4136L12.15 6.95L6.22279 6.95C5.72574 6.95 5.32279 6.54706 5.32279 6.05C5.32279 5.55294 5.72574 5.15 6.22279 5.15Z'
          fill='white'
          fillOpacity='0.5'
        />
      </svg>
    </LinkText>
  )
}
