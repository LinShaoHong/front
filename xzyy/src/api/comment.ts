import request from '@/utils/request'
import { Resp, ListResp, PageResp } from './response'

export const getComments = (params: any): Resp | any =>
  request({
    url: `/v1/xzyy/comment`,
    method: 'get',
    params
  })

export const addComment = (data: any): Resp | any =>
  request({
    url: `/v1/xzyy/comment`,
    method: 'post',
    data
  })

export const reply = (id: string, data: any): Resp | any =>
  request({
    url: `/v1/xzyy/comment/reply/$` + id,
    method: 'post',
    data
  })

export const replyMessage = (params: any): PageResp | any =>
  request({
    url: `/v1/xzyy/comment/reply/message`,
    method: 'get',
    params
  })

export const read = (id: string): Resp | any =>
  request({
    url: `/v1/xzyy/comment/read/$` + id,
    method: 'put'
  })

export const readAll = (): Resp | any =>
  request({
    url: `/v1/xzyy/comment/readAll`,
    method: 'put'
  })

export const getUnRead = (): ListResp | any =>
  request({
    url: `/v1/xzyy/comment/unRead`,
    method: 'get'
  })

export const likeComment = (id: string): Resp | any =>
  request({
    url: `/v1/xzyy/comment/like/$` + id,
    method: 'put'
  })

export const hateComment = (id: string): Resp | any =>
  request({
    url: `/v1/xzyy/comment/hate/$` + id,
    method: 'put'
  })

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
  replies: [{
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
  }]
}
