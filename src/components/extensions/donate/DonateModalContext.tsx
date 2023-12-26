import { createContext, useContext, useState } from 'react'

export type DonateModalContextState = {
  showSwitchButton: boolean
  setShowSwitchButton: (show: boolean) => void
  disableButton: boolean
  setDisableButton: (disable: boolean) => void
}

const DonateModalContext = createContext<DonateModalContextState>({} as any)

type ContextWrapperProps = {
  children: React.ReactNode
}

export const DonateModalContextWrapper: React.FC<ContextWrapperProps> = ({
  children,
}) => {
  const [showSwitchButton, setShowSwitchButton] = useState(true)
  const [disableButton, setDisableButton] = useState(false)

  const value = {
    showSwitchButton,
    setShowSwitchButton,
    disableButton,
    setDisableButton,
  }

  return (
    <DonateModalContext.Provider value={value}>
      {children}
    </DonateModalContext.Provider>
  )
}

export const useDonateModalContext = () => useContext(DonateModalContext)
