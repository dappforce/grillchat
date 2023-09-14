import CustomToast from '@/components/Toast'
import { ReactNode, useEffect, useRef } from 'react'
import { toast, Toast, ToastOptions } from 'react-hot-toast'

export function showErrorToast<ErrorType>(
  error: unknown,
  errorTitle: ReactNode,
  config?: {
    getDescription?: (t: Toast) => ReactNode
    getMessage?: (error: ErrorType) => string
    actionButton?: (t: Toast) => ReactNode
    toastConfig?: ToastOptions
  }
) {
  const { actionButton, getMessage, toastConfig } = config ?? {}
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
        type='error'
        title={errorTitle}
        subtitle={message}
        description={config?.getDescription?.(t)}
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
