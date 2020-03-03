import request from '@/utils/request'

export function listRole(query) {
  return request({
    url: '/role',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export function readRole(data) {
  return request({
    url: '/role/$' + data.id,
    method: 'get'
  })
}

export function updateRole(data) {
  return request({
    url: '/role/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/role/$' + data.id,
    method: 'delete'
  })
}

export function getPermission(query) {
  return request({
    url: '/permission',
    method: 'get',
    params: query
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission',
    method: 'put',
    data
  })
}

export function roleOptions(query) {
  return request({
    url: '/role/options',
    method: 'get',
    params: query
  })
}
