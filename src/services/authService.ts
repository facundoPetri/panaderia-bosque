import { AxiosRequestConfig, AxiosResponse } from 'axios'


import { Api } from '../common/api'
import { apiConfig } from '../common/api.config'
import { LoginResponse } from '../interfaces/auth'


const ENDPOINT = '/auth'


class AuthServiceApi extends Api {
 public constructor(config: AxiosRequestConfig) {
   super(config)


   // this middleware is been called right before the http request is made.
   this.interceptors.request.use((param: AxiosRequestConfig) => ({
     ...param
   }))


   // this middleware is been called right bjsonplaceholder.typicode.comefore the response is get it by the method that triggers the request
   this.interceptors.response.use((param: AxiosResponse) => ({
     ...param
   }))


   Object.setPrototypeOf(this, AuthServiceApi.prototype)
   this.loggedIn = this.loggedIn.bind(this)
   this.logIn = this.logIn.bind(this)
 }


 public async loggedIn(): Promise<boolean> {
   try {
     const res: AxiosResponse<boolean> = await this.get<string, AxiosResponse<boolean>>(
       '/session/'
     )
     if (res.status === 200 || res.statusText === 'OK') {
       return true
     }
     return false
   } catch (error) {
        console.log(error)
     return false
   }
 }

 public async logIn({
   username,
   password
 }: {
   username: string
   password: string
 }): Promise<LoginResponse> {
   const res: AxiosResponse<LoginResponse> = await this.post<
     string,
     { username: string; password: string },
     AxiosResponse<LoginResponse>
   >(`${ENDPOINT}/login`, { username: username, password: password }, {})
   return this.success(res)
 }


 public async logOut(): Promise<any> {
   try {
     const res: AxiosResponse<void> = await this.get<string, AxiosResponse<void>>(
       `${ENDPOINT}/logout/`
     )
     return this.success(res)
   } catch (error) {
     return false
   }
 }

 public async changePassword(password: string): Promise<any> {
   try {
     const res: AxiosResponse<any> = await this.post(
       `${ENDPOINT}/changePassword/`,
       { password },
       {
         headers: { 'Content-Type': 'application/json' }
       }
     )
     return this.success(res)
   } catch (error) {
     throw error
   }
 }
}


export const authServiceApi = new AuthServiceApi(apiConfig)