import request from '@/utils/request'

// export function loginByUsername(username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }
export function loginByUsername(username, password) {
  const data = {
    account: username,
    password: password,
    validateCode: '',
    loginWay: 0,
    loginFrom: 'pc'
  }
  return request({
    url: '/Login/Common',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function login(data) {
  return request({
    url: '/Login/Common',
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

export function changePassword(data) {
  return request({
    url: '/User/ChangePassword',
    method: 'post',
    data
  })
}

