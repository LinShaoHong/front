import request from '@/utils/request'
import {ListResp, PageResp, Resp} from './response'

export const getComments = (params: any): Resp | any =>
  request({
    url: `/v1/qm/comment`,
    method: 'get',
    params
  })

export const addComment = (data: any): Resp | any =>
  request({
    url: `/v1/qm/comment`,
    method: 'post',
    data
  })

export const reply = (id: string, data: any): Resp | any =>
  request({
    url: `/v1/qm/comment/reply/$` + id,
    method: 'post',
    data
  })

export const replyMessage = (params: any): PageResp | any =>
  request({
    url: `/v1/qm/comment/reply/message`,
    method: 'get',
    params
  })

export const read = (id: string): Resp | any =>
  request({
    url: `/v1/qm/comment/read/$` + id,
    method: 'put'
  })

export const readAll = (): Resp | any =>
  request({
    url: `/v1/qm/comment/readAll`,
    method: 'put'
  })

export const getUnRead = (): ListResp | any =>
  request({
    url: `/v1/qm/comment/unRead`,
    method: 'get'
  })

export const likeComment = (id: string): Resp | any =>
  request({
    url: `/v1/qm/comment/like/$` + id,
    method: 'put'
  })

export const hateComment = (id: string): Resp | any =>
  request({
    url: `/v1/qm/comment/hate/$` + id,
    method: 'put'
  })

export interface ReplyResp {
  id: string
  avatar: string
  commentatorId: string
  commentatorName: string
  replierId: string
  replierName: string
  content: string
  time: string
  likes: number
  hates: number
  liked: boolean
  hated: boolean
  read: boolean
}

export interface CommentResp {
  id: string
  avatar: string
  commentatorId: string
  commentatorName: string
  content: string
  time: string
  likes: number
  hates: number
  liked: boolean
  hated: boolean
  expand: boolean
  read: boolean
  replies: ReplyResp[]
}
