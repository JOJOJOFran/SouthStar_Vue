import request from '@/utils/request'

// 单位列表
export function deptList() {
  return request({
    url: '/Department/AllList',
    method: 'get'
  })
}

// 用车申请列表
export function applyList(query) {
  return request({
    url: '/VehicleApply/List',
    method: 'get',
    params: query
  })
}

// 用车申请详情
export function applyDetail(query) {
  return request({
    url: '/VehicleApply/item/' + query,
    method: 'get'
  })
}

// 新增用车申请（提交）
export function addApply(data) {
  return request({
    url: '/VehicleApply/AddAndSend',
    method: 'post',
    data
  })
}

// 新增用车申请（草稿）
export function addApplyDraft(data) {
  return request({
    url: '/VehicleApply/AddNotSend',
    method: 'post',
    data
  })
}

// 提交草稿（草稿）
export function submityDraft(id, data) {
  return request({
    url: '/VehicleApply/Update/' + id,
    method: 'post',
    data
  })
}

// 用车审批列表
export function checkList(query) {
  return request({
    url: '/Check/List',
    method: 'get',
    params: query
  })
}

// 用车审批信息
export function checkItem(query) {
  return request({
    url: '/Check/DetailItem/' + query,
    method: 'get'
  })
}

// 用车审批
export function check(checkId, data) {
  return request({
    url: '/Check/Check/' + checkId,
    method: 'post',
    data
  })
}


export function scheduleList(query) {
  return request({
    url: '/Dispatch/List',
    method: 'get',
    params: query
  })
}


export function dispatch(id, data) {
  return request({
    url: '/Dispatch/Dispatch/' + id,
    method: 'post',
    data
  })
}

export function redispatch(id, data) {
  return request({
    url: '/Dispatch/ReDispatch/' + id,
    method: 'post',
    data
  })
}

// 用车审批信息
export function scheduleItem(query) {
  return request({
    url: '/Dispatch/Item/' + query,
    method: 'get'
  })
}

// 派单列表
export function dispatchList(query) {
  return request({
    url: '/Dispatch/DispatchList',
    method: 'get',
    params: query
  })
}

// 派单列表
export function dispatchItem(dispatchId) {
  return request({
    url: '/Dispatch/Item/' + dispatchId,
    method: 'get'
  })
}

// 获取可用司机
export function driverEnableList() {
  return request({
    url: '/Driver/EnableList',
    method: 'get'
  })
}

// 获取可用车辆
export function vehicleEnableList() {
  return request({
    url: '/Vehicle/EnableList',
    method: 'get'
  })
}

export function quickDispatch(data) {
  return request({
    url: '/Dispatch/QuickDispatch',
    method: 'post',
    data
  })
}

//快速派车--模糊查询用车申请单
export function listByApplyNum(query) {
  return request({
    url: '/Dispatch/ListByApplyNum',
    method: 'get',
    params:query
  })
}

//快速派车--查询车辆详情
export function queryItemByPlateNum(query) {
  return request({
    url: '/Vehicle/ItemByPlateNum',
    method: 'get',
    params:query
  })
}

//核算
export function recieptSet(data) {
  return request({
    url: '/Reciept/Set',
    method: 'post',
    data
  })
}
export function recieptGet(dipatchId) {
  return request({
    url: '/Reciept/Get?dipatchId='+dipatchId,
    method: 'Get',
  })
}

//取表单cookie
export function getQuickDispatchCache(key) {
  return request({
    url: '/Dispatch/GetQuickDispatchCache?key='+key,
    method: 'Get',
  })
}
//存表单cookie
export function setQuickDispatchCache(key,data) {
  return request({
    url: '/Dispatch/SetQuickDispatchCache?key='+key,
    method: 'Post',
    data
  })
}

//取消派车单
export function cancelOrder(dispatchId) {
  return request({
    url: '/Dispatch/Cancel/'+dispatchId ,
    method: 'Get',
  })
}

//删除
export function deleteOrder(dispatchId) {
  return request({
    url: '/Dispatch/Delete/'+dispatchId ,
    method: 'Get',
  })
}



