import request from '@/utils/request'
import { Resp, PageResp, ListResp, SingleResp } from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/xzyy/girls',
    method: 'get',
    params
  })

export const hot = (params: any): ListResp | any =>
  request({
    url: '/v1/xzyy/girls/hot',
    method: 'get',
    params
  })

export const detail = (id: any): SingleResp | any =>
  request({
    url: '/v1/xzyy/girls/$' + id,
    method: 'get'
  })

export const like = (id: string, params: any): Resp | any =>
  request({
    url: '/v1/xzyy/girls/like/$' + id,
    method: 'put',
    params
  })

export const recommendation = (id: string, params: any): ListResp | any =>
  request({
    url: '/v1/xzyy/girls/recommendation/$' + id,
    method: 'get',
    params
  })

export const search = (params: any): SingleResp | any =>
  request({
    url: '/v1/xzyy/girls/search',
    method: 'get',
    params
  })



