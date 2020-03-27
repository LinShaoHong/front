import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const listMessages = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/message',
    method: 'get',
    params
  })

export const addMessage = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/message',
    method: 'post',
    data
  })

export const updateMessage = (id: string, data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/message/$' + id,
    method: 'put',
    data
  })

export const deleteMessage = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/message/$' + id,
    method: 'delete'
  })

export const sendEmail = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/message/email',
    method: 'post',
    data
  })
