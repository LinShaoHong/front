import request from '@/utils/request'
import { Resp } from './response'

export const getCollections = (params: any): Resp | any =>
  request({
    url: `/v1/qm/collection`,
    method: 'get',
    params
  })

export const addCollection = (data: any): Resp | any =>
  request({
    url: `/v1/qm/collection`,
    method: 'post',
    data
  })

export const deleteCollection = (id: string): Resp | any =>
  request({
    url: `/v1/qm/collection/$` + id,
    method: 'delete'
  })

export const deleteByGirlId = (data: any): Resp | any =>
  request({
    url: `/v1/qm/collection/byGirlId`,
    method: 'delete',
    data
  })
