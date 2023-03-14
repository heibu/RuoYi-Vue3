import request from '@/utils/request'

const sm = {
     /**
     * 获取物品明细
     * 
     */
      getItemList(query){
        return request({
            url: '/mostore/getItemList',
            method: 'get',
            params: query
        })
     },
     /** 申请物品出库/入库 */
     storeActApp(query){
        return request({
            url: '/mostore/storeActApp',
            method: 'get',
            params: query
        })
     },
     /**
      * 获取单条仓库物品基础资料，用于修改
      */
    getItemDetail(id){
        return request({
            url: '/mostore/getItemDetail',
            method: 'get',
            params: id
        })
    },
    /**
     * 修改单条物品资料
     * @param {*} params 
     * @returns 
     */
    updateItem(params){
        return request({
            url: '/mostore/updateItem',
            method: 'get',
            params: params
        })
    },
    /**
     * 新增单条物品资料
     * @param {*} params 
     * @returns 
     */
     addItem(params){
        return request({
            url: '/mostore/addItem',
            method: 'get',
            params: params
        })
    },
    /**
     * 查询出入库明细
     */
    getStoreIOList(query){
        return request({
            url: '/mostore/getStoreIOList',
            method: 'get',
            params: query
        })
    }
}

export default sm