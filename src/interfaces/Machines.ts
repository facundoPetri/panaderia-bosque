import { UsersResponse } from "./Users"

export interface MachinesResponse {
  _id: string
  name: string
  description: string
  purchase_date: string
  desired_maintenance: number
  last_maintenance_date: string
  createdAt: string
  updatedAt: string
  user_id: UsersResponse
}

export interface TransformedMachines {
  _id: string
  name: string
  description: string
  purchase_date: string
  desired_maintenance: number
  last_maintenance_date: string
  createdAt: string
  updatedAt: string
  priority: string
  user_name: string
}

