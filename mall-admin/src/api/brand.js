import request from '@/utils/request'

export function listBrand(query) {
  return request({
    url: '/brand',
    method: 'get',
    params: query
  })
}

export function createBrand(data) {
  return request({
    url: '/brand',
    method: 'post',
    data
  })
}

export function readBrand(data) {
  return request({
    url: '/brand/$' + data.id,
    method: 'get'
  })
}

export function updateBrand(data) {
  return request({
    url: '/brand/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteBrand(data) {
  return request({
    url: '/brand/$' + data.id,
    method: 'delete',
    data
  })
}
