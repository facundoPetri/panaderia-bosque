import { SuppliesResponse } from './Supplies'
import { UsersResponse } from './Users'

export interface RecipesResponse {
  _id: string
  author: UsersResponse
  createdAt: string
  ingredients: string
  name: string
  recommendations: string
  standardUnits: string
  state: boolean
  steps: string
  supplies: SuppliesResponse[]
  updatedAt: string
}

export interface TransformedRecipes {
  _id: string
  author: string
  createdAt: string
  ingredients: string
  name: string
  recommendations: string
  standardUnits: string
  state: true
  steps: string
  supplies: string
  updatedAt: string
}
