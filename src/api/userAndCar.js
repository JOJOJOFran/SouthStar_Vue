import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/CommonPwd',
    method: 'post',
    data
  })
}

export function vehicleList(query) {
  return request({
    url: '/Vehicle/List',
    method: 'get',
    params: query
  })
}

export function vehicleItem(query) {
  return request({
    url: '/Vehicle/Item/' + query,
    method: 'get'
  })
}

export function vehicleAdd(data) {
  return request({
    url: '/Vehicle/Add',
    method: 'post',
    data
  })
}

export function vehicleUpdate(query, data) {
  return request({
    url: '/Vehicle/Update/' + query,
    method: 'post',
    data
  })
}

export function vehicleDelete(query) {
  return request({
    url: '/Vehicle/Delete/' + query,
    method: 'delete'
  })
}

export function driverList(query) {
  return request({
    url: '/Driver/List',
    method: 'get',
    params: query
  })
}

export function driverItem(query) {
  return request({
    url: '/Driver/Item/' + query,
    method: 'get'
  })
}

export function driverAdd(data) {
  return request({
    url: '/Driver/Add',
    method: 'post',
    data
  })
}

export function driverUpdate(query, data) {
  return request({
    url: '/Driver/Update/' + query,
    method: 'post',
    data
  })
}

export function driverDelete(query) {
  return request({
    url: '/Driver/Delete/' + query,
    method: 'delete'
  })
}

export function userList(query) {
  return request({
    url: '/User/List',
    method: 'get',
    params: query
  })
}

export function userItem(query) {
  return request({
    url: '/User/Item/' + query,
    method: 'get'
  })
}

export function userAdd(data) {
  return request({
    url: '/User/Add',
    method: 'post',
    data
  })
}

export function userUpdate(query, data) {
  return request({
    url: '/User/Update/' + query,
    method: 'post',
    data
  })
}

export function userDelete(query) {
  return request({
    url: '/User/Delete/' + query,
    method: 'delete'
  })
}

// 单位列表
export function deptList() {
  return request({
    url: '/Department/AllList',
    method: 'get'
  })
}

// 单位列表
export function roleList() {
  return request({
    url: '/Role/AllList',
    method: 'get'
  })
}

// 获取上传图片token
export function getImageToken(data) {
  return request({
    url: '/Qiniu/UploadToken',
    method: 'get',
    params: data
  })
}

