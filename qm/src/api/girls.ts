import request from '@/utils/request'
import {ListResp, PageResp, Resp, SingleResp} from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/girls',
    method: 'get',
    params
  })

export const getIndex = (params: any): ListResp | any =>
  request({
    url: '/v1/qm/girls/index',
    method: 'get',
    params
  })

export const detail = (id: any): SingleResp | any =>
  request({
    url: '/v1/qm/girls/$' + id,
    method: 'get'
  })

export const like = (id: string, params: any): Resp | any =>
  request({
    url: '/v1/qm/girls/like/$' + id,
    method: 'put',
    params
  })

export const recommendation = (id: string, params: any): ListResp | any =>
  request({
    url: '/v1/qm/girls/recommendation/$' + id,
    method: 'get',
    params
  })

export const search = (params: any): SingleResp | any =>
  request({
    url: '/v1/qm/girls/search',
    method: 'get',
    params
  })

export const city = (params: any): ListResp | any =>
  request({
    url: '/v1/qm/girls/city',
    method: 'get',
    params
  })

export const getCategory = (params: any): ListResp | any =>
  request({
    url: '/v1/qm/girls/category',
    method: 'get',
    params
  })



