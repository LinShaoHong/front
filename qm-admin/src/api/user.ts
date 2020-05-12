import request from '@/utils/request'
import { PageResp, SingleResp } from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/user',
    method: 'get',
    params
  })

export const update = (id: string, data: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/user/$' + id,
    method: 'put',
    data
  })

export const stat = (params: any): SingleResp | any =>
  request({
    url: '/v1/qm/admin/user/stat',
    method: 'get',
    params
  })

