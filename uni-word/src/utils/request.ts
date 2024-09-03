import {isDevelopment, isH5} from './platform';
import env from '@/config/env';
import {hideLoading} from '@/config/serviceLoading';

export const networkError = () => {
    uni.showToast({
        title: '网络不给力',
        icon: 'error'
    });
}

// h5环境开启代理
const apiBaseUrl = isH5 && isDevelopment ? '/api' : env.apiBaseUrl;

export function request(
    method:
        | 'OPTIONS'
        | 'GET'
        | 'HEAD'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'TRACE'
        | 'CONNECT'
        | undefined,
    url: string,
    data: any
) {
    return new Promise((resolve, reject) => {
        let responseData: unknown;
        uni.request({
            url: url.startsWith('http') ? url : apiBaseUrl + url,
            method,
            timeout: 200000,
            header: {
                'content-type': 'application/json; charset=utf-8'
            },
            data,
            success: (res: any) => {
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    if (res.data.code >= 200 && res.data.code < 400) {
                        responseData = res.data;
                    } else {
                        reject(res.data);
                    }
                } else {
                    reject(res.data);
                }
            },
            fail: () => {
                reject('网络不给力');
            },
            complete: (data) => {
                resolve(responseData);
                hideLoading();
            }
        });
    });
}

const http = {
    get: <T>(api: string, params: any) =>
        request('GET', api, {
            ...params
        }) as Http.Response<T>,
    post: <T>(api: string, params: any) =>
        request('POST', api, {
            ...params
        }) as Http.Response<T>,
    put: <T>(api: string, params: any) =>
        request('PUT', api, {
            ...params
        }) as Http.Response<T>,
    delete: <T>(api: string, params: any) =>
        request('DELETE', api, {
            ...params
        }) as Http.Response<T>
};

export default http;
