import { API_URL } from "./Constants";

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
    method: RequestMethod
    body?: BodyInit
    headers?: Record<string, string>
    credentials?: RequestCredentials
}

export interface ApiResponse<T = any> {
    status: number;
    response: T;
    message?: string;
}

const fetchApi = async <T = any>(url: string, options: RequestOptions) => {
    try {
        const response = await fetch(API_URL + url, {
            method: options.method,
            headers: {
                ...options.headers
            },
            body: options.body,
            credentials: options.credentials,
        });
        
        const json: ApiResponse<T> = await response.json();

        return json;
    } catch(err) {
        const failResponse: ApiResponse = {
            status: 400,
            response: undefined
        }

        return failResponse;
    }
};

export default fetchApi;