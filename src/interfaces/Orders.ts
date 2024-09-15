import { ProviderResponse } from './Providers'
import { SuppliesResponse } from './Supplies'

export interface OrderResponse {
  _id: string
  number: number //es quantity que tiene este nombre
  date: Date
  created_at: Date
  provider: ProviderResponse
  supplies: SuppliesResponse[]
}