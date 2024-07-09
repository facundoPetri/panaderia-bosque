import axios, { AxiosResponse } from 'axios';
import { API_BASE_URL } from './commonConsts';

interface Request<T> {
    path: string;
    data?: any;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const request = async <T>({ path, data, method }: Request<T>): Promise<AxiosResponse<T> | void> => {
    try {
        let res: AxiosResponse<T>;
        switch (method) {
            case 'GET':
                res = await axios.get<T>(`${API_BASE_URL}${path}`);
                break;
            case 'POST':
                res = await axios.post<T>(`${API_BASE_URL}${path}`, data);
                break;
            case 'PUT':
                res = await axios.put<T>(`${API_BASE_URL}${path}`, data);
                break;
            case 'DELETE':
                res = await axios.delete<T>(`${API_BASE_URL}${path}`);
                break;
            default:
                throw new Error(`Unsupported method: ${method}`);
        }
        return res as AxiosResponse<T>
    } catch (error) {
        throw error
    }
}
