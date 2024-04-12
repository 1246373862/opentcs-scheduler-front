import request from '@/utils/request'

// 获取point
export function getOrders(query) {
  return request({
    url: '/order/page',
    method: 'get',
    params: query
  })
}

export function withdraw(query) {
  return request({
    url: '/order/withdraw',
    method: 'put',
    data: query
  })
}
export function selectOneByName(query) {
  return request({
    url: '/order/select',
    method: 'get',
    params: query
  })
}

export function createOrder(post) {
  return request({
    url: '/order/create',
    method: 'post',
    data: post
  })
}
export function updateOrders(post) {
  return request({
    url: '/order/update',
    method: 'put',
    data: post
  })
}