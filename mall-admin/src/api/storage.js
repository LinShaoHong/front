import request from '@/utils/request'

export function listStorage(query) {
  return request({
    url: '/storage',
    method: 'get',
    params: query
  })
}

export function createStorage(data) {
  return request({
    url: '/storage',
    method: 'post',
    data
  })
}

export function readStorage(data) {
  return request({
    url: '/storage/$' + data.id,
    method: 'get'
  })
}

export function updateStorage(data) {
  return request({
    url: '/storage/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteStorage(data) {
  return request({
    url: '/storage/$' + data.id,
    method: 'delete'
  })
}

const uploadPath = process.env.VUE_APP_BASE_API + '/storage/create'
export { uploadPath }
