import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/admin',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

export function readminAdmin(data) {
  return request({
    url: '/admin/$' + data.id,
    method: 'get'
  })
}

export function updateAdmin(data) {
  return request({
    url: '/admin/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/admin/$' + data.id,
    method: 'delete'
  })
}
