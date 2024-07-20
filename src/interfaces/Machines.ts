import { UsersResponse } from "./Users"

export interface MachinesResponse {
  _id: string
  name: string
  description: string
  purchase_date: string
  desired_maintenance: number
  user_id: UsersResponse
}

