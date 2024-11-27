import { SuppliesResponse } from './Supplies'

export interface Batch {
  _id: string
  batch_number: number
  row: number
  column: number
  date_of_entry: string
  quantity: number
  expiration_date: string
  supply_id: null | SuppliesResponse
}
export interface BatchCreateData extends Omit<Batch, '_id' | 'supply_id'> {
  supply_id: string
}
export interface FormattedBatch {
  _id: string
  batch_number: string
  row: string
  column: string
  date_of_entry: string
  quantity: number
  expiration_date: string
  supply_id: string
}
