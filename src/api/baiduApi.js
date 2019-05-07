import request from '@/utils/request'

export function queryCars(data, callback) {
  return request({
    url: 'http://yingyan.baidu.com/api/v3/entity/list?callback=' + callback,
    method: 'GET',
    param: data
  })
}

export function login(data) {
  return request({
    url: '/Login/CommonPwd',
    method: 'post',
    data
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

