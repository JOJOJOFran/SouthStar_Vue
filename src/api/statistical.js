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

//获取派车报表
export function reportPlatenum(query) {
  return request({
    url: '/DispatchStatistics/Report1/report/platenum',
    method: 'get',
    params: query
  })
}


//获取每月按用车性质出车次数
export function monthCount(query) {
  return request({
    url: '/DispatchStatistics/MonthCount',
    method: 'get',
    params: query
  })
}

//获取每天按用车性质出车次数
export function dayCount(query) {
  return request({
    url: '/DispatchStatistics/DayCount',
    method: 'get',
    params: query
  })
}

//核算
export function setUnitPrice(data) {
  return request({
    url: '/Reciept/SetUnitPrice',
    method: 'post',
    data
  })
}


