import request from '@/utils/request2'
import { ListResp, SingleResp } from './response'

export const getResult = (data: any):ListResp|any =>
  request({
    url: '/api/admin/consoles/sql/query',
    method: 'post',
    data
  })

export const update = (data: any):SingleResp|any =>
  request({
    url: '/api/admin/consoles/sql/write',
    method: 'post',
    data
  })

export const getTables = (params: any):ListResp|any =>
  request({
    url: '/api/admin/consoles/sql/tables',
    method: 'get',
    params
  })
