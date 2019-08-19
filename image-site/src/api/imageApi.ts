import request from '@/utils/request'
import { PageResp, ListResp, SingleResp } from './response'

export interface IPageParam {
  start: number,
  count: number,
  type?: string,
  category?: string,
  rank?: string
}

export const getPaged = (params: IPageParam): PageResp | any =>
  request({
    url: '/api/v1/images',
    method: 'get',
    params
  })

export const getDetails = (imgId: string): ListResp | any =>
  request({
    url: `/api/v1/images/details/${imgId}`,
    method: 'get'
  })

export const like = (imgId: string, params: any): any =>
  request({
    url: `/api/v1/images/like/${imgId}`,
    method: 'put',
    params
  })

export const getRecommendations = (imgId: string, params: any): any =>
  request({
    url: `/api/v1/images/recommendation/${imgId}`,
    method: 'get',
    params
  })

export const search = (params: { q: string }): SingleResp | any =>
  request({
    url: '/api/v1/images/search',
    method: 'get',
    params
  })
