import axios, { AxiosResponse } from 'axios'
import { API_BASE_URL } from './commonConsts'

interface Request<T> {
  path: string
  data?: any
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  token?: string
}

export const request = async <T>({
  path,
  data,
  method,
  token,
}: Request<T>): Promise<T | void> => {
  try {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {}
    let res: AxiosResponse<T>
    switch (method) {
      case 'GET':
        res = await axios.get<T>(`${API_BASE_URL}${path}`, { headers })
        break
      case 'POST':
        res = await axios.post<T>(`${API_BASE_URL}${path}`, data, { headers })
        break
      case 'PUT':
        res = await axios.put<T>(`${API_BASE_URL}${path}`, data, { headers })
        break
      case 'DELETE':
        res = await axios.delete<T>(`${API_BASE_URL}${path}`, { headers })
        break
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
    return res.data
  } catch (error) {
    throw error
  }
}
