import request from '@/utils/request2'
import { ListResp } from './response'

export const getJobs = (params: any): ListResp | any =>
  request({
    url: '/api/spider/jobs',
    method: 'get',
    params
  })

export const getGroups = (): ListResp | any =>
  request({
    url: '/api/spider/jobs/groups',
    method: 'get'
  })

export const create = (data: any) =>
  request({
    url: '/api/spider/jobs',
    method: 'post',
    data
  })

export const update = (id: string, data: any) =>
  request({
    url: `/api/spider/jobs/${id}`,
    method: 'put',
    data
  })
