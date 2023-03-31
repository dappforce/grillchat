import { cx } from '@/utils/class-names'
import { ComponentProps } from 'react'
import LinkText from '../LinkText'

export type CaptchaTermsAndServiceProps = Omit<ComponentProps<'p'>, 'children'>

export default function CaptchaTermsAndService({
  ...props
}: CaptchaTermsAndServiceProps) {
  return (
    <p {...props} className={cx('text-sm text-text-muted', props.className)}>
      This site is protected by reCAPTCHA and the Google{' '}
      <LinkText
        openInNewTab
        variant='primary'
        href='https://policies.google.com/privacy'
      >
        Privacy Policy
      </LinkText>{' '}
      and{' '}
      <LinkText
        openInNewTab
        variant='primary'
        href='https://policies.google.com/terms'
      >
        Terms of Service
      </LinkText>{' '}
      apply.
    </p>
  )
}
