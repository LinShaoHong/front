import request from '@/utils/request'

export function listAd(query) {
  return request({
    url: '/advertise',
    method: 'get',
    params: query
  })
}

export function createAd(data) {
  return request({
    url: '/advertise',
    method: 'post',
    data
  })
}

export function readAd(data) {
  return request({
    url: '/advertise/$' + data.id,
    method: 'get'
  })
}

export function updateAd(data) {
  return request({
    url: '/advertise/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteAd(data) {
  return request({
    url: '/advertise/$' + data.id,
    method: 'delete'
  })
}
