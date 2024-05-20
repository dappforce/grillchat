import { createContext, useContext, useState } from 'react'

export type DonateModalContextState = {
  disableButton: boolean
  setDisableButton?: (disable: boolean) => void
  showChatForm: boolean
  setShowChatForm?: (show: boolean) => void
}

const DonateModalContext = createContext<DonateModalContextState>({} as any)

type ContextWrapperProps = {
  children: React.ReactNode
}

export const DonateModalContextWrapper: React.FC<ContextWrapperProps> = ({
  children,
}) => {
  const [disableButton, setDisableButton] = useState(false)
  const [showChatForm, setShowChatForm] = useState(true)

  const value = {
    disableButton,
    setDisableButton,
    showChatForm,
    setShowChatForm,
  }

  return (
    <DonateModalContext.Provider value={value}>
      {children}
    </DonateModalContext.Provider>
  )
}

export const useDonateModalContext = () => useContext(DonateModalContext)
