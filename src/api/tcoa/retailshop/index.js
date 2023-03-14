import request from '@/utils/request'

const rs = {
     /**
     * 获取整体数据
     */
      getList(retailshopEntity){
        return request({
            url: '/retailshop/getList',
            method: 'get',
            params: retailshopEntity
        })
     },
     /**
     * showdetail
     */
      getShopDetail(shopsn){
        return request({
            url: '/retailshop/getShopDetail',
            method: 'get',
            params: shopsn
        })
     },
     /**
     * 根据网点号获取业主信息
     */
      getAgentDetail(agent_idcard){
        return request({
            url: '/retailshop/getAgentDetail',
            method: 'get',
            params: agent_idcard
        })
     },
     /**
      * 根据业主身份证获取开店记录
      */
      getAgentShoplist(agent_idcard){
        return request({
            url: '/retailshop/getAgentShoplist',
            method: 'get',
            params: agent_idcard
        })
     },
     /**
      * 根据网点编号获取积分记录
      */
      getShopPointsRecords(shopsn){
        return request({
            url: '/retailshop/getShopPointsRecords',
            method: 'get',
            params: shopsn
        })
     },
}

export default rs