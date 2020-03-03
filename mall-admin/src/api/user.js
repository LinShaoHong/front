import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

export function listAddress(query) {
  return request({
    url: '/address',
    method: 'get',
    params: query
  })
}

export function listCollect(query) {
  return request({
    url: '/collection',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/feedback',
    method: 'get',
    params: query
  })
}

export function listFootprint(query) {
  return request({
    url: '/footprint',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/searchHistory',
    method: 'get',
    params: query
  })
}

