import request from '@/utils/request'

export function listIssue(query) {
  return request({
    url: '/issue',
    method: 'get',
    params: query
  })
}

export function createIssue(data) {
  return request({
    url: '/issue',
    method: 'post',
    data
  })
}

export function readIssue(data) {
  return request({
    url: '/issue/$' + data.id,
    method: 'get'
  })
}

export function updateIssue(data) {
  return request({
    url: '/issue/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteIssue(data) {
  return request({
    url: '/issue/$' + data.id,
    method: 'delete'
  })
}
