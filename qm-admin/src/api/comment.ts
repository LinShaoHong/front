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
