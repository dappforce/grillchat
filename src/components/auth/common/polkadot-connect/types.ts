export type PolkadotConnectSteps =
  | 'polkadot-connect'
  | 'polkadot-connect-account'
  | 'polkadot-connect-confirmation'
  | 'polkadot-js-limited-support'

export type PolkadotConnectContentProps = {
  setCurrentState: (state: PolkadotConnectSteps) => void
  closeModal: () => void
}
