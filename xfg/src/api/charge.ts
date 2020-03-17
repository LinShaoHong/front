import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const recharge = (data: any): Resp | any =>
  request({
    url: `/v1/xfg/charge/recharge`,
    method: 'post',
    data
  })

export const consume = (data: any): Resp | any =>
  request({
    url: `/v1/xfg/charge/consume`,
    method: 'post',
    data
  })

export const flow = (params: any): PageResp | any =>
  request({
    url: `/v1/xfg/charge/flow`,
    method: 'get',
    params
  })

export interface FlowResp {
  amount: number
  type: string
  chargeType: string
  time: string
  girl: {
    id: string
    name: string
    type: string
    mainImage: string
    onService: boolean
  }
}
