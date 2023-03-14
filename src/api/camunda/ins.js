import request from '@/utils/request'

const ins = {
    
    /** */
    getInsCreatedByMe(p){
        return request({
            url: '/camunda/getInsCreatedByMe',
            method: 'get',
            params:p
        })
    },
    /**
      * 根据insId发送催促短信
      */
     urgeBySMS(insId){
        return request({
            url: '/camunda/urgeBySMS',
            method: 'get',
            params: insId
        })
     },
    /**
     * 获取高亮节点
     * 
     */
     getHighLightNodes(params){
        return request({
            url: '/camunda/history/getHighlightDiagram',
            method: 'get',
            params: params
        })
     },
     /**
     * 根据task exection获取高亮节点
     * 
     */
      getHighLightNodesByExecution(params){
        return request({
            url: '/camunda/history/getHighLightNodesByExecution',
            method: 'get',
            params: params
        })
     },
     /**
      * 删除instance草稿
      */
      delDraftByinsID(insID){
        return request({
            url: '/camunda/delDraftByinsID',
            method: 'get',
            params: insID
        })
      },
      /**
      * 删除instance
      */
       delInsByID(insID){
        return request({
            url: '/camunda/delInsByID',
            method: 'get',
            params: insID
        })
      },
      /**
       * 获取comments
       */
       getCommentsByinsId(param){
        return request({
            url: '/camunda/history/getCommentsByinsId',
            method: 'get',
            params: param
        })
       }
}

export default ins