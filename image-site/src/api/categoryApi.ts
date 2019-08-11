import request from '@/utils/request'
import { ListResp } from './response'

export const getCategories = (): ListResp | any =>
  request({
    url: '/api/v1/categories',
    method: 'get'
  })
