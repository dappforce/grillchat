import Toast from '@/components/Toast'
import { useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

export default function useToastError<ErrorType>(
  error: unknown,
  errorTitle: string,
  getMessage?: (error: ErrorType) => string
) {
  const getMessageRef = useRef(getMessage)
  useEffect(() => {
    if (error) {
      let message: string | undefined = (error as any)?.message

      const response = (error as any)?.response?.data
      if (response && getMessageRef.current) {
        const responseMessage = getMessageRef.current(response)
        if (responseMessage) message = responseMessage
      }

      toast.custom((t) => (
        <Toast
          t={t}
          icon={(classNames) => (
            <HiOutlineExclamationTriangle className={classNames} />
          )}
          title={errorTitle}
          description={message}
        />
      ))
    }
  }, [error, errorTitle])
}
