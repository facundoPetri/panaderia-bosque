import { OrderState } from './Orders'

export interface QualityAndPunctuality {
  id: string
  name: string
  provider: string
  reportDate: string
  author: string
  deliveredItem: string
  rating: number
  estimatedDate: string
  receivedDate: string
}

export interface ReportingOrderResponse {
  _id: string
  author: { email: string; fullname: string; _id: string }
  created_at: string
  estimated_date: string
  name: string
  order: {
    _id: string
    created_at: string
    number: string
    received_date: string
    state: OrderState
  }
  provider: { name: string; _id: string; email: string; phone: string }
  quality: number
  quality_details: string
  supplies: { name: string; _id: string }[]
}

export interface PostReportingOrder {
  name: string
  author: string
  order: string
  quality_details?: string
  quality: number
}
