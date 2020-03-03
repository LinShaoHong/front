import request from '@/utils/request'

export function listLog(query) {
  return request({
    url: '/log',
    method: 'get',
    params: query
  })
}
