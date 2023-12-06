import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const listFootprints = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/footprints',
    method: 'get',
    params
  })
