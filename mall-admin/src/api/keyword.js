import request from '@/utils/request'

export function listKeyword(query) {
  return request({
    url: '/keyword',
    method: 'get',
    params: query
  })
}

export function createKeyword(data) {
  return request({
    url: '/keyword',
    method: 'post',
    data
  })
}

export function readKeyword(data) {
  return request({
    url: '/keyword/$' + data.id,
    method: 'get'
  })
}

export function updateKeyword(data) {
  return request({
    url: '/keyword/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteKeyword(data) {
  return request({
    url: '/keyword/$' + data.id,
    method: 'delete'
  })
}
