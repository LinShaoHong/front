import request from '@/utils/request'
import { SingleResp } from './response'

export const login = (data: any): SingleResp | any =>
  request({
    url: '/v1/qm/admin/session/login',
    method: 'post',
    data
  })
