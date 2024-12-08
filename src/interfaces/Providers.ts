import { SuppliesResponse } from './Supplies'

export interface ProviderResponse {
  _id: string
  name: string
  phone: string
  email: string
  supplies: SuppliesResponse[]
  image?: string
  estimated_delivery_time: number
  createdAt: Date
  updatedAt?: Date
}

export interface TransformedProvider {
  _id: string
  name: string
  phone: string
  email: string
  supplies: string
  image?: string
  estimated_delivery_time: number
  createdAt: Date
  updatedAt?: Date
}

export interface PostProvider {
  _id: string
  name: string
  phone: string
  email: string
  supplies: SuppliesResponse[]
  image?: string
  estimated_delivery_time: number
  createdAt: string
  updatedAt?: Date
}
