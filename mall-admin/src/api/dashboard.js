import request from '@/utils/request'

export function info() {
  return request({
    url: '/dashboard'
  })
}
