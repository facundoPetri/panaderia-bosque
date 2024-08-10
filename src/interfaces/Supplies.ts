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
}
export interface SuppliesCreateData
  extends Omit<SuppliesResponse, '_id' | 'size'> {
  image: string
  size: number
}
