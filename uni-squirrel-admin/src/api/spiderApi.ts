import request from '@/utils/request'
import { ListResp, SingleResp } from './response'

export const getJobs = (params: any): ListResp | any =>
  request({
    url: '/v1/spider/jobs',
    method: 'get',
    params
  })

export const getGroups = (): ListResp | any =>
  request({
    url: '/v1/spider/jobs/groups',
    method: 'get'
  })

export const create = (data: any) =>
  request({
    url: '/v1/spider/jobs',
    method: 'post',
    data
  })

export const update = (id: string, data: any) =>
  request({
    url: `/v1/spider/jobs/${id}`,
    method: 'put',
    data
  })

export const deleteJob = (id: string) =>
  request({
    url: `/v1/spider/jobs/${id}`,
    method: 'delete'
  })

export const clearCheckpoint = (id: string) =>
  request({
    url: `/v1/spider/jobs/checkpoint/${id}`,
    method: 'delete'
  })

export const publish = (id: string) =>
  request({
    url: `/v1/spider/jobs/publish/${id}`,
    method: 'put'
  })

export const unPublish = (id: string) =>
  request({
    url: `/v1/spider/jobs/unPublish/${id}`,
    method: 'put'
  })

export const testJob = (data: any): SingleResp | any =>
  request({
    url: `/v1/spider/jobs/test`,
    method: 'post',
    data
  })

export const deleteTest = (requestId: string) =>
  request({
    url: `/v1/spider/jobs/test/${requestId}`,
    method: 'delete'
  })

export const getProgress = (id: string): ListResp | any =>
  request({
    url: `/v1/spider/jobs/progress/${id}`,
    method: 'get'
  })

export const getLatestProgresses = (id: string): SingleResp | any =>
  request({
    url: `/v1/spider/jobs/progress/latest/${id}`,
    method: 'get'
  })
