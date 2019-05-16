import request from '@/utils/request'

// 年检提醒
export function motReminderList(query) {
  return request({
    url: '/MOTReminder/List',
    method: 'get',
    params: query
  })
}

export function motReminderDelete(query) {
  return request({
    url: '/MOTReminder/Delete/' + query,
    method: 'delete'
  })
}

export function motReminder(query) {
  return request({
    url: '/MOTReminder/item/' + query,
    method: 'get'
  })
}

export function motReminderUpdate(id, data) {
  return request({
    url: '/MOTReminder/Update/' + id,
    method: 'post',
    data
  })
}

export function motReminderAdd(data) {
  return request({
    url: '/MOTReminder/Add',
    method: 'post',
    data
  })
}

// 维修、保养
export function maintainList(query) {
  return request({
    url: '/Maintain/List',
    method: 'get',
    params: query
  })
}

export function maintainAdd(data) {
  return request({
    url: '/Maintain/Add',
    method: 'post',
    data
  })
}

export function maintainItem(query) {
  return request({
    url: '/Maintain/Item?Id='+query,
    method: 'get'
  })
}

export function maintainDelete(query) {
  return request({
    url: '/Maintain/Delete?Id=' + query,
    method: 'post'
  })
}
export function maintainUpdate(id, data) {
  return request({
    url: '/Maintain/Update?Id=' + id,
    method: 'post',
    data
  })
}

export function vehicleAllList() {
  return request({
    url: '/Vehicle/AllList',
    method: 'get'
  })
}


// 保险提醒
// export function insuranceReminderList(query) {
//   return request({
//     url: '/InsuranceReminder/List',
//     method: 'get',
//     params: query
//   })
// }

// export function insuranceReminderDelete(query) {
//   return request({
//     url: '/InsuranceReminder/Delete/' + query,
//     method: 'delete'
//   })
// }

// export function insuranceReminder(query) {
//   return request({
//     url: '/InsuranceReminder/item/' + query,
//     method: 'get'
//   })
// }

// export function insuranceReminderUpdate(id, data) {
//   return request({
//     url: '/InsuranceReminder/Update/' + id,
//     method: 'post',
//     data
//   })
// }

// export function insuranceReminderAdd(data) {
//   return request({
//     url: '/InsuranceReminder/add',
//     method: 'post',
//     data
//   })
// }

//导入保险明细数据
export function importInsurance(typeCode,keyName,year,data) {
  return request({
    url: '/Journal/ImportInsurance?typeCode='+typeCode+'&keyName='+keyName+'&year='+year,
    method: 'post',
    data
  })
}

export function insuranceList(query) {
  return request({
    url: '/Journal/Insurance',
    method: 'get',
    params:query
  })
}

