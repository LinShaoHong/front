import request from '@/utils/request'

export function listCategory(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function listCatL1() {
  return request({
    url: '/category/l1',
    method: 'get'
  })
}

export function createCategory(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function readCategory(data) {
  return request({
    url: '/category/$' + data.id,
    method: 'get',
    data
  })
}

export function updateCategory(data) {
  return request({
    url: '/category/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteCategory(data) {
  return request({
    url: '/category/$' + data.id,
    method: 'delete',
    data
  })
}
