import { Maintenance } from './Maintenance'

export interface MachinesResponse {
  _id: string
  name: string
  description: string
  purcharse_date: string
  desired_maintenance: number
  maintenance: Maintenance[]
  require_maintenance: boolean
}

export interface TransformedMachines {
  _id: string
  name: string
  purcharse_date: string
  desired_maintenance: number
  last_maintenance_date: string
  description?: string
  require_maintenance?: string
}

export enum MaintenanceFilter {
  ALL = 'none',
  YES = 'true',
  NO = 'false',
}
