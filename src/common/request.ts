import axios, { AxiosResponse } from 'axios'
import { API_BASE_URL } from './commonConsts'
import { toast } from 'react-toastify';

interface Request<T> {
  path: string
  data?: any
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

export const request = async <T>({
  path,
  data,
  method,
}: Request<T>): Promise<T | void> => {
  try {
    const token = sessionStorage.getItem('token') || ''
    const headers = token ? { Authorization: `Bearer ${token}` } : {}
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
      case 'PATCH':
        res = await axios.patch<T>(`${API_BASE_URL}${path}`, data, { headers })
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

export const requestToast = async <T>({
  path,
  data,
  method,
  successMessage,
  errorMessage,
  pendingMessage
}: Request<T> & { successMessage: string; errorMessage: string, pendingMessage: string }) => {
  return toast.promise(request<T>({ path, data, method }), {
    pending: pendingMessage,
    success: successMessage,
    error: errorMessage,
  })
}
