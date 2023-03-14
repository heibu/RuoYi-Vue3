import request from '@/utils/request'

const as = {
     /**
     * 获取整体数据
     */
      getAllUpdates(){
        return request({
            url: '/codeupdate/getItemList',
            method: 'get',
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

export default as