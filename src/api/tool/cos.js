import request from '@/utils/request'

// 查询生成表数据
export function getCosSign(query) {
  return request({
    url: 'https://tcapp.tshon.cn/index/Cosauth/tcoaGetCos',
    method: 'get',
    params: query
  })
}