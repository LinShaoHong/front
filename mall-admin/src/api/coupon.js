import request from '@/utils/request'

export function listCoupon(query) {
  return request({
    url: '/coupon',
    method: 'get',
    params: query
  })
}

export function createCoupon(data) {
  return request({
    url: '/coupon',
    method: 'post',
    data
  })
}

export function readCoupon(id) {
  return request({
    url: '/coupon/$' + id,
    method: 'get'
  })
}

export function updateCoupon(data) {
  return request({
    url: '/coupon/$' + data.id,
    method: 'put',
    data
  })
}

export function deleteCoupon(data) {
  return request({
    url: '/coupon/delete/$' + data.id,
    method: 'delete'
  })
}

export function listCouponUser(query) {
  return request({
    url: '/coupon/queryUser',
    method: 'get',
    params: query
  })
}
