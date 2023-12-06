import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const listCollects = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/collects',
    method: 'get',
    params
  })
