import request from '@/utils/request'
import { Resp, PageResp, ListResp, SingleResp } from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/xfg/girls',
    method: 'get',
    params
  })

export const hot = (params: any): ListResp | any =>
  request({
    url: '/v1/xfg/girls/hot',
    method: 'get',
    params
  })

export const detail = (id: any): SingleResp | any =>
  request({
    url: '/v1/xfg/girls/$' + id,
    method: 'get'
  })

export const like = (id: string, params: any): Resp | any =>
  request({
    url: '/v1/xfg/girls/like/$' + id,
    method: 'put',
    params
  })

export const recommendation = (id: string, params: any): ListResp | any =>
  request({
    url: '/v1/xfg/girls/recommendation/$' + id,
    method: 'get',
    params
  })

export const search = (id: string, params: any): SingleResp | any =>
  request({
    url: '/v1/xfg/girls/search',
    method: 'get',
    params
  })



