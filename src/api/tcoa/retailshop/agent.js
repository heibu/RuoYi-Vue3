import request from '@/utils/request'

const rs = {
     /**
     * 获取整体数据
     */
      getList(entity){
        return request({
            url: '/retailshop/getAgentList',
            method: 'get',
            params: entity
        })
     },
     /**
     * 添加数据
     */
      addupdateContent(params){
        return request({
          url: '/codeupdate/addupdateContent',
          method: 'post',
          data: params
      })
     },
}

export default rs