import request from '@/utils/request'

//导入保险明细数据
export function importInsurance(typeCode,keyName,year,data) {
  return request({
    url: '/Journal/ImportInsurance?typeCode='+typeCode+'&keyName='+keyName+'&year='+year,
    method: 'post',
    data
  })
}


//导入保险明细数据
export function typeList() {
  return request({
    url: '/Journal/TypeList',
    method: 'get',
  })
}

