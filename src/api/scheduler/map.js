import request from '@/utils/request'

// 获取point
export function getPoints() {
  return request({
    url: '/map/points',
    method: 'get'
  })
}

