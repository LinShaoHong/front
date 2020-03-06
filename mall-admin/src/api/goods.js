import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/goods',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/goods/$ + data.id',
    method: 'delete'
  })
}

export function publishGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/goods/$' + id,
    method: 'get'
  })
}

export function editGoods(data) {
  return request({
    url: '/goods/$' + data.id,
    method: 'put',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/goods/catAndBrand',
    method: 'get'
  })
}
