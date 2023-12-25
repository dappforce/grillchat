import { createContext, useContext, useState } from 'react'

export type DonateModalContextState = {
  showSwitchButton: boolean
  setShowSwitchButton: (show: boolean) => void
}

const DonateModalContext = createContext<DonateModalContextState>({} as any)

type ContextWrapperProps = {
  children: React.ReactNode
}

export const DonateModalContextWrapper: React.FC<ContextWrapperProps> = ({
  children,
}) => {
  const [showSwitchButton, setShowSwitchButton] = useState(true)

  const value = {
    showSwitchButton,
    setShowSwitchButton,
  }

  return (
    <DonateModalContext.Provider value={value}>
      {children}
    </DonateModalContext.Provider>
  )
}

export const useDonateModalContext = () => useContext(DonateModalContext)
