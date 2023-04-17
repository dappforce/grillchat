export type ApiResponse<AdditionalData = {}> = {
  success: boolean
  message: string
  errors?: any
} & AdditionalData
