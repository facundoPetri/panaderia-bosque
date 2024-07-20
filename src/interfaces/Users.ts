export interface UsersResponse {
  _id: string
  fullname: string
  email: string
  password: string
  type: string
  state: boolean
  image: string
  createdAt: string
  lastSession: string
}

export interface TransformedUser {
  _id: string;
  fullname: string;
  email: string;
  password: string;
  type: string;
  state: string;
  image: string;
  createdAt: string;
  lastSession: string;
}