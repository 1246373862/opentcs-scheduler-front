import request from '@/utils/request'

// 查询车辆列表
export function listVehicles(query) {
  return request({
    url: '/vehicle/page',
    method: 'get',
    params: query
  })
}



export function initVehicle(query) {
  return request({
    url: '/vehicle/init',
    method: 'post',
    data: query
  })
}

export function pausedVehicle(query) {
  return request({
    url: '/vehicle/paused',
    method: 'post',
    data: query
  })
}