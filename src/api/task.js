import request from '@/utils/request'

export function addTaskPost (data) {
  return request({
    url: '/api/task/add',
    method: 'post',
    data
  })
}

export function taskList (data) {
  return request({
    url: '/api/task/list',
    method: 'post',
    data
  })
}

export function taskDelete (data) {
  return request({
    url: '/api/task/delete',
    method: 'post',
    data
  })
}

export function getOTaskList (data) {
  return request({
    url: '/api/task/OTaskList',
    method: 'post',
    data
  })
}

export function deleteOTask (data) {
  return request({
    url: '/api/task/OTdelete',
    method: 'post',
    data
  })
}

export function comepleteOTask (data) {
  return request({
    url: '/api/task/OTComeplete',
    method: 'post',
    data
  })
}

export function pushTask (data) {
  return request({
    url: '/api/task/push',
    method: 'post',
    data
  })
}
