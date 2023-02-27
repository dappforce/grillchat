import type { Keyring } from '@polkadot/keyring'
import type { ComponentProps, JSXElementConstructor } from 'react'

export type PolymorphicTypes = React.ElementType | JSXElementConstructor<any>
export type PolymorphicProps<Type extends PolymorphicTypes> = {
  as?: Type
} & Omit<ComponentProps<Type>, 'as'>

export type Signer = ReturnType<Keyring['addFromSeed']>
