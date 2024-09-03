import request from '@/utils/request'
import {ListResp, PageResp, Resp} from './response'

export const recharge = (data: any): Resp | any =>
  request({
    url: `/v1/qm/charge/recharge`,
    method: 'post',
    data
  })

export const consume = (data: any): Resp | any =>
  request({
    url: `/v1/qm/charge/consume`,
    method: 'post',
    data
  })

export const flow = (params: any): PageResp | any =>
  request({
    url: `/v1/qm/charge/flow`,
    method: 'get',
    params
  })


export const yq = (): ListResp | any =>
  request({
    url: `/v1/qm/charge/yq`,
    method: 'get'
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
