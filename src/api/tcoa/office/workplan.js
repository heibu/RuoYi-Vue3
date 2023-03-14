import request from '@/utils/request'

const wp = {
     /**
     * 获取所有预算计划数据
     */
      getWorkplanList(){
        return request({
            url: '/workplan/getWorkplanList',
            method: 'get',
        })
     },
     /**
      * 获取资料，用于修改
      */
    getItemDetail(id){
      return request({
          url: '/workplan/getItemDetail',
          method: 'get',
          params: id
      })
    },
    /**
     * 修改资料
     * @param {*} params 
     * @returns 
     */
     updateItem(params){
      return request({
          url: '/workplan/updateItem',
          method: 'post',
          data: params
      })
    },
    /**
     * 添加计划
     * @param {*} params 
     * @returns 
     */
     addItem(params){
      return request({
          url: '/workplan/addItem',
          method: 'post',
          data: params
      })
    },
    // 删除计划
    delPlan(ids) {
      return request({
        url: '/workplan/remove/' + ids,
        method: 'delete'
      })
    }

}

export default wp