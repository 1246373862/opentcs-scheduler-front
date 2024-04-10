import request from '@/utils/request'

// 获取point
export function getOrders() {
  return request({
    url: '/order/page',
    method: 'get'
  })
}