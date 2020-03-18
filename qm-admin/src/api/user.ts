import request from '@/utils/request'
import { PageResp } from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/user',
    method: 'get',
    params
  })

