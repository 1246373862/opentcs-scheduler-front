import request from '@/utils/request'

// 获取point
export function getPoints() {
  return request({
    url: '/map/points',
    method: 'get'
  })
}

// 获取地图信息
export function getMap() {
  return request({
    url: '/map/map',
    method: 'get'
  })
}

export function getLocations() {
  return request({
    url: '/map/locations',
    method: 'get'
  })
}