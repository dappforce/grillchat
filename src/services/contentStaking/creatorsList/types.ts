type RegisteredState = 'Active' | Record<'Inactive', string>

export type RegisteredCreator = {
  spaceId: string
  stakeholder: string
  status: RegisteredState
}