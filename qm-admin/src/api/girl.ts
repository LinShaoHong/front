import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const listGirls = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/girl',
    method: 'get',
    params
  })

export const getGirl = (id: any): Resp | any =>
  request({
    url: '/v1/qm/admin/girl/$' + id,
    method: 'get',
  })

export const createGirl = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/girl',
    method: 'post',
    data
  })

export const updateGirl = (id: any, data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/girl/$' + id,
    method: 'put',
    data
  })

export const unShelveGirl = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/girl/unShelve/$' + id,
    method: 'put'
  })

export const deleteGirl = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/girl/$' + id,
    method: 'delete'
  })

export const publishGirl = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/girl/publish/$' + id,
    method: 'put'
  })

export const stat = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/girl/stat',
    method: 'get',
    params
  })
