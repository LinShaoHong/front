import request from '@/utils/request'
import { ListResp, SingleResp } from './response'

export const getResult = (data: any):ListResp|any =>
  request({
    url: '/v1/sql/query',
    method: 'post',
    data
  })

export const update = (data: any):SingleResp|any =>
  request({
    url: '/v1/sql/write',
    method: 'post',
    data
  })

export const getTables = (params: any):ListResp|any =>
  request({
    url: '/v1/sql/tables',
    method: 'get',
    params
  })
