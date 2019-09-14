import request from '@/utils/request'
import { ListResp } from './response'

export const getCategories = (): ListResp | any =>
  request({
    url: '/v1/categories',
    method: 'get'
  })
