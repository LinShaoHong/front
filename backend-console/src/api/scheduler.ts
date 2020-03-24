import request from '@/utils/request'
import { ListResp, SingleResp } from './response'

export const getJobs = (): ListResp | any =>
  request({
    url: '/v1/scheduler/jobs',
    method: 'get'
  })

export const getJob = (id: string): SingleResp | any =>
  request({
    url: '/v1/scheduler/jobs/$' + id,
    method: 'get'
  })

export const getJobNames = (): ListResp | any =>
  request({
    url: '/v1/scheduler/jobs/names',
    method: 'get'
  })

export const createJob = (data: any) =>
  request({
    url: '/v1/scheduler/jobs',
    method: 'post',
    data
  })

export const updateJob = (id: string, data: any) =>
  request({
    url: `/v1/scheduler/jobs/$${id}`,
    method: 'put',
    data
  })

export const deleteJob = (id: string) =>
  request({
    url: `/v1/scheduler/jobs/$${id}`,
    method: 'delete'
  })

export const publishJob = (id: string) =>
  request({
    url: `/v1/scheduler/jobs/publish/$${id}`,
    method: 'put'
  })

export const unPublishJob = (id: string) =>
  request({
    url: `/v1/scheduler/jobs/unPublish/$${id}`,
    method: 'put'
  })

export const getProgress = (id: string): SingleResp | any =>
  request({
    url: `/v1/scheduler/jobs/progress/$${id}`,
    method: 'get'
  })

export const getLatestProgresses = (id: string): ListResp | any =>
  request({
    url: `/v1/scheduler/jobs/progress/latest/$${id}`,
    method: 'get'
  })
