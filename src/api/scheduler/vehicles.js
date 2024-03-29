import request from '@/utils/request'

// 查询车辆列表
export function listVehicles(query) {
  return request({
    url: '/vehicle/page',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/system/post/' + postId,
    method: 'get'
  })
}