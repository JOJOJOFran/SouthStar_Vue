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

// 维修记录
export function repairRecordList(query) {
  return request({
    url: '/RepairRecord/List',
    method: 'get',
    params: query
  })
}

export function repairRecordAdd(data) {
  return request({
    url: '/RepairRecord/Add',
    method: 'post',
    data
  })
}

export function repairRecord(query) {
  return request({
    url: '/RepairRecord/item/' + query,
    method: 'get'
  })
}

export function repairRecordDelete(query) {
  return request({
    url: '/RepairRecord/item/' + query,
    method: 'delete'
  })
}
export function repairRecordUpdate(id, data) {
  return request({
    url: '/RepairRecord/update/' + id,
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

// 保养提醒
export function maintainReminderList(query) {
  return request({
    url: '/MaintainReminder/List',
    method: 'get',
    params: query
  })
}

export function maintainReminderDelete(query) {
  return request({
    url: '/MaintainReminder/Delete/' + query,
    method: 'delete'
  })
}

export function maintainReminder(query) {
  return request({
    url: '/MaintainReminder/item/' + query,
    method: 'get'
  })
}

export function maintainReminderUpdate(id, data) {
  return request({
    url: '/MaintainReminder/Update/' + id,
    method: 'post',
    data
  })
}

export function maintainReminderAdd(data) {
  return request({
    url: '/MaintainReminder/add',
    method: 'post',
    data
  })
}

// 保险提醒
export function insuranceReminderList(query) {
  return request({
    url: '/InsuranceReminder/List',
    method: 'get',
    params: query
  })
}

export function insuranceReminderDelete(query) {
  return request({
    url: '/InsuranceReminder/Delete/' + query,
    method: 'delete'
  })
}

export function insuranceReminder(query) {
  return request({
    url: '/InsuranceReminder/item/' + query,
    method: 'get'
  })
}

export function insuranceReminderUpdate(id, data) {
  return request({
    url: '/InsuranceReminder/Update/' + id,
    method: 'post',
    data
  })
}

export function insuranceReminderAdd(data) {
  return request({
    url: '/InsuranceReminder/add',
    method: 'post',
    data
  })
}

//导入保险明细数据
export function importInsurance(typeCode,keyName,year,data) {
  return request({
    url: '/Journal/ImportInsurance?typeCode='+typeCode+'&keyName='+keyName+'&year='+year,
    method: 'post',
    data
  })
}

