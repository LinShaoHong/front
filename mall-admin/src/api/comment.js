import request from '@/utils/request'

export function listComment(query) {
  return request({
    url: '/comment',
    method: 'get',
    params: query
  })
}

export function deleteComment(data) {
  return request({
    url: '/comment/$' + data.id,
    method: 'delete'
  })
}
