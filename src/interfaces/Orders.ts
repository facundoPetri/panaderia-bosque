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

export interface TransformedOrder {
  _id: string
  number: number
  date: string
  created_at: string
  provider: string
  supplies: string[]
}

