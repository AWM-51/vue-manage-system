import request from '@/utils/request'

export function getOrginazation (data) {
  return request({
    url: '/api/sgc/getOrginazation',
    method: 'post',
    data
  })
}

