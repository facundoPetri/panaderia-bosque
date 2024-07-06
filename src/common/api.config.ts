import qs from 'qs'
import { PathLike } from 'fs'
import { AxiosRequestConfig } from 'axios'
import { API_BASE_URL } from './connectionConsts'


const baseURL = `${API_BASE_URL}`


export const apiConfig: AxiosRequestConfig = {
 withCredentials: true,
 timeout: 14400000, //60 * 60 * 4 * 1000,
 baseURL,
 headers: {
   Accept: 'application/json, text/javascript, */*; q=0.01',
   'Content-Type': 'application/json'
 },
 //@ts-ignore
 paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false })
}
