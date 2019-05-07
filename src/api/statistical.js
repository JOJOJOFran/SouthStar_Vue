import request from '@/utils/request'

//根据期间获取所有派车单上的用车部门名称列表
export function dispatchDept() {
  return request({
    url: '/DispatchStatistics/DispatchDept',
    method: 'get',
  })
}

//获取派车单报表
export function reportList(query) {
  return request({
    url: '/DispatchStatistics/Report',
    method: 'get',
    params: query
  })
}


//获取派车单报表
export function setUnitPrice(data) {
  return request({
    url: '/Reciept/SetUnitPrice',
    method: 'post',
    data
  })
}


