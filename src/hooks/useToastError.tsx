import CustomToast from '@/components/Toast'
import { ReactNode, useEffect, useRef } from 'react'
import { toast, Toast, ToastOptions } from 'react-hot-toast'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

export function showErrorToast<ErrorType>(
  error: unknown,
  errorTitle: ReactNode,
  config?: {
    additionalDescription?: (t: Toast) => ReactNode
    withIcon?: boolean
    getMessage?: (error: ErrorType) => string
    actionButton?: (t: Toast) => ReactNode
    toastConfig?: ToastOptions
  }
) {
  const {
    actionButton,
    getMessage,
    toastConfig,
    withIcon = true,
  } = config ?? {}
  let message: string | undefined = (error as any)?.message

  const response = (error as any)?.response?.data
  if (getMessage) {
    const responseMessage = getMessage(response)
    if (responseMessage) message = responseMessage
  }

  toast.custom(
    (t) => (
      <CustomToast
        t={t}
        icon={
          withIcon
            ? (classNames) => (
                <HiOutlineExclamationTriangle className={classNames} />
              )
            : undefined
        }
        title={errorTitle}
        description={
          <div className='flex flex-col'>
            <p>{message}</p>
            {config?.additionalDescription?.(t)}
          </div>
        }
        action={actionButton?.(t)}
      />
    ),
    toastConfig
  )
}

export default function useToastError<ErrorType>(
  error: unknown,
  errorTitle: string,
  getMessage?: (error: ErrorType) => string
) {
  const getMessageRef = useRef(getMessage)
  useEffect(() => {
    if (error) {
      showErrorToast(error, errorTitle, { getMessage: getMessageRef.current })
    }
  }, [error, errorTitle])
}
