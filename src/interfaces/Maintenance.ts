import { MachinesResponse } from "./Machines"
import { UsersResponse } from "./Users"

export interface Maintenance {
    _id: string
    date: string
    description: string
    user: UsersResponse
    machine: MachinesResponse
  }
  export interface TransformedMaintenance {
    _id: string
    date: string
    description: string
    user: string
    machine: string
  }