import request from '@/utils/request'

// 查詢和导出轨迹
export function tracelist(query) {
  return request({
    url: '/tracelist',
    method: 'get',
    params: query
  })
}

