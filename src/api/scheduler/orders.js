import request from '@/utils/request'

// 获取point
export function getOrders() {
  return request({
    url: '/order/page',
    method: 'get'
  })
}

export function withdraw(query) {
  return request({
    url: '/order/withdraw',
    method: 'put',
    data: query
  })
}