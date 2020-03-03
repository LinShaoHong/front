import request from '@/utils/request'

export function listAftersale(query) {
  return request({
    url: '/afterSale/list',
    method: 'get',
    params: query
  })
}

export function receptAftersale(data) {
  return request({
    url: '/afterSale/recept',
    method: 'post',
    data
  })
}

export function batchReceptAftersale(data) {
  return request({
    url: '/afterSale/batch-recept',
    method: 'post',
    data
  })
}

export function rejectAftersale(data) {
  return request({
    url: '/afterSale/reject',
    method: 'post',
    data
  })
}

export function batchRejectAftersale(data) {
  return request({
    url: '/afterSale/batch-reject',
    method: 'post',
    data
  })
}

export function refundAftersale(data) {
  return request({
    url: '/afterSale/refund',
    method: 'post',
    data
  })
}
