import request from '@/utils/request'
import { Resp } from './response'

export const getFootprints = (params: any): Resp | any =>
  request({
    url: `/v1/xzyy/footprint`,
    method: 'get',
    params
  })
