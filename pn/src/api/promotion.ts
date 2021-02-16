import request from '@/utils/request'
import { Resp, ListResp } from './response'

export const getPromotions = (): ListResp | any =>
  request({
    url: `/v1/qm/promotion`,
    method: 'get'
  })

export const createPromotion = (data: any): Resp | any =>
  request({
    url: `/v1/qm/promotion`,
    method: 'post',
    data
  })

export const getTreatment = (): Resp | any =>
  request({
    url: `/v1/qm/promotion/treatment`,
    method: 'get'
  })

export interface PromotionResp {
  id: string
  images: string[]
  applyTime: string
  passed: boolean
}
