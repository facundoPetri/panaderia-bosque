export interface MachinesResponse {
  _id: string
  name: string
  description: string
  purchase_date: string
  desired_maintenance: number
  user_id: User
}
export interface User {
  _id: string
  fullname: string
  email: string
  password: string
  type: string
  state: boolean
  image: string
  createdAt: string
}
