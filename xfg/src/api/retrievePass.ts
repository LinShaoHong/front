import request from '@/utils/request'


export const url = (data: any): any =>
  request({
    url: '/v1/xfg/retrievePass/url',
    method: 'post',
    data
  })

export const check = (data: any): any =>
  request({
    url: '/v1/xfg/retrievePass/check',
    method: 'post',
    data
  })

export const change = (data: any): any =>
  request({
    url: '/v1/xfg/retrievePass/change',
    method: 'put',
    data
  })
