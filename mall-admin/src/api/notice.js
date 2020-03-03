import request from '@/utils/request'

export function listNotice(query) {
  return request({
    url: '/notice',
    method: 'get',
    params: query
  })
}

export function createNotice(data) {
  return request({
    url: '/notice',
    method: 'post',
    data
  })
}

export function readNotice(id) {
  return request({
    url: '/notice/$' + id,
    method: 'get'
  })
}

export function updateNotice(data) {
  return request({
    url: '/notice/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteNotice(data) {
  return request({
    url: '/notice/$' + data.id,
    method: 'delete'
  })
}

export function batchDeleteNotice(data) {
  return request({
    url: '/notice/[' + data.ids.join(',') + ']',
    method: 'delete'
  })
}
