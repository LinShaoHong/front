import request from '@/utils/request'
import { Resp, PageResp } from './response'

export const listComments = (params: any): PageResp | any =>
  request({
    url: '/v1/qm/admin/comment',
    method: 'get',
    params
  })

export const deleteComment = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/comment/$' + id,
    method: 'delete'
  })

export const privateComment = (id: string): Resp | any =>
  request({
    url: '/v1/qm/admin/comment/private/$' + id,
    method: 'put'
  })

export const noticeComment = (data: any): Resp | any =>
  request({
    url: '/v1/qm/admin/comment',
    method: 'post',
    data
  })
