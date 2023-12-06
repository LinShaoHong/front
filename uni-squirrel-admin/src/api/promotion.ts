import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: `/v1/qm/admin/promotion`,
    method: 'get',
    params
  })

export const approve = (id: string, data: any): Resp | any =>
  request({
    url: `/v1/qm/admin/promotion/$` + id + '/pass',
    method: 'put',
    data
  })

export const reject = (id: string): Resp | any =>
  request({
    url: `/v1/qm/admin/promotion/$` + id + '/reject',
    method: 'put'
  })
