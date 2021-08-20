import request from '@/utils/request'

export function getMockUriList (data) {
  return request({
    url: '/middledata/mockDatahandle/getMockInterfaceList',
    method: 'post',
    data
  })
}

export function getMockResList (data) {
  return request({
    url: '/middledata/mockDatahandle/getMockResList',
    method: 'post',
    data
  })
}

export function getMockParamList (data) {
  return request({
    url: '/middledata/mockDatahandle/getMockParamList',
    method: 'post',
    data
  })
}
