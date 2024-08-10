export interface SuppliesResponse {
  _id: string
  name: string
  description: string
  min_stock: number
  max_stock: number
  unit: string
  size: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  batches?: Batch[]
}

export interface SuppliesCreateData
  extends Omit<SuppliesResponse, '_id' | 'size'> {
  image: string
  size: number
}

export interface TransformedSupplies {
  _id: string
  name: string
  description: string
  current_stock: number
  min_stock: number
  max_stock: number
  unit: string
  size: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
  priority: string
}

export interface Batch {
  _id: string
  expiration_date: string
  date_of_entry: string
  quantity: number
  batch_number: number
  row: number
  column: number
  supply_id: string
  __v: number
}

export interface TransformedBatch {
  _id: string
  expiration_date: string
  date_of_entry: string
  quantity: string
  batch_number: number
  location: string
  supply_name: string
}