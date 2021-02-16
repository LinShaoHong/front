import request from '@/utils/request'
import {PageResp, Resp, ListResp, SingleResp} from './response'

export const paged = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/charge',
    method: 'get',
    params
  })

export const add = (data: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/charge',
    method: 'post',
    data
  })

export const del = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/charge/$' + id,
    method: 'delete'
  })

export const addYQ = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/charge/yq',
    method: 'post',
    data
  })

export const getYQ = (): ListResp | any =>
  request({
    url: '/v1/qm/admin/charge/yq/',
    method: 'get'
  })

export const yqDel = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/charge/yq/$' + id,
    method: 'delete'
  })

export const rechargeTotal = (): PageResp | any =>
  request({
    url: '/v1/qm/admin/charge/total/',
    method: 'get'
  })

export const payLog = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/charge/payLog/',
    method: 'get',
    params
  })

export const stat = (params: any): SingleResp | any =>
  request({
    url: '/v1/qm/admin/charge/stat',
    method: 'get',
    params
  })
