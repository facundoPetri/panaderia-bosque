import { ProviderResponse } from './Providers'

interface OrderSupply {
  supplyId: {
    _id: string
    name: string
  }
  quantity: number
  _id: string
}

export enum OrderState {
  CREATED = 'Creado',
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  CANCELLED = 'Cancelado',
}

export enum OrderStateFilter {
  ALL = 'Todos',
  CREATED = 'Creado',
  PENDING = 'Pendiente',
  COMPLETED = 'Completado',
  CANCELLED = 'Cancelado',
}

export interface OrderResponse {
  _id: string
  number: number
  created_at: string
  provider: ProviderResponse
  supplies: OrderSupply[]
  state: OrderState
  received_date?: string
  cancelled_description?: string
}

export interface OrderBody {
  created_at?: string
  provider: string
  supplies: { supplyId: string | null; quantity: number }[]
}

export interface TransformedOrder {
  _id: string
  number: number
  created_at: string
  provider: string
  supplies: string
  state: OrderState
}
