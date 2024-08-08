import { UsersResponse } from './Users'

export interface RecipesResponse {
  _id: string
  author: UsersResponse
  createdAt: string
  ingredients: string
  name: string
  recommendations: string
  standardUnits: string
  state: true
  steps: string
  supplies: []
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
  supplies: []
  updatedAt: string
}
