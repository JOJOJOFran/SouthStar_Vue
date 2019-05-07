import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setNewToken(key,token) {
  return Cookies.set(key, token)
}

export function getNewToken(key) {
  return Cookies.get(key)
}

export function removeNewToken(key) {
  return Cookies.remove(key)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
