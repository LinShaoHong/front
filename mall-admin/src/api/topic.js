import request from '@/utils/request'

export function listTopic(query) {
  return request({
    url: '/topic',
    method: 'get',
    params: query
  })
}

export function createTopic(data) {
  return request({
    url: '/topic',
    method: 'post',
    data
  })
}

export function readTopic(data) {
  return request({
    url: '/topic/$' + data.id,
    method: 'get'
  })
}

export function updateTopic(data) {
  return request({
    url: '/topic/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteTopic(data) {
  return request({
    url: '/topic/$' + data.id,
    method: 'delete'
  })
}

export function batchDeleteTopic(data) {
  return request({
    url: '/topic/[' + data.ids.join(',') + ']',
    method: 'delete'
  })
}
