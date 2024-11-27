import { UsersResponse } from './Users'

interface WasteSupply {
  supplyId: {
    _id: string
    name: string
  }
  quantity: number
  _id: string
}

export interface WasteResponse {
  _id: string
  motive: string
  supplies: WasteSupply[]
  reporter: UsersResponse
  responsible: UsersResponse
  date: string
}

export interface WasteBody {
  motive: string
  supplies: { supplyId: string | null; quantity: number }[]
  reporter: string
  responsible: string
  date: Date | null
}

export interface WasteReport {
  id: string
  date: string
  reportingEmployee: string
  reason: string
  involvedEmployee: string
  wastedSupplies: string
}

export interface WasteFormData {
  reporter: { name: string; id: string }
  involved: { name: string; id: string }
  date: Date | null
  reason: string
  items: { supply: string; supplyId: string; quantity: string }[]
}
