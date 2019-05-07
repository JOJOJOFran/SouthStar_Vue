import request from '@/utils/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}

export function getQiniuToken(key) {
  return request({
    url: '/Qiniu/UploadToken?filekey='+key, // 假地址 自行替换
    method: 'get'
  })
}
