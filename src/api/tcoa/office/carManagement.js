import request from '@/utils/request'

const sm = {
     /**
     * 获取车辆明细
     * 
     */
      getItemList(query){
        return request({
            url: '/mocar/getItemList',
            method: 'get',
            params: query
        })
     },
     /**
     * 获取车辆最近使用明细
     * 
     */
      getIoList(carId){
        return request({
            url: '/mocar/getIoList',
            method: 'get',
            params: carId
        })
     },
     /** 申请车辆出库/入库 */
     storeActApp(query){
        return request({
            url: '/mocar/storeActApp',
            method: 'get',
            params: query
        })
     },
     /**
      * 获取单条仓库车辆基础资料，用于修改
      */
    getItemDetail(id){
        return request({
            url: '/mocar/getItemDetail',
            method: 'get',
            params: id
        })
    },
    /**
     * 修改单条车辆资料
     * @param {*} params 
     * @returns 
     */
    updateItem(params){
        return request({
            url: '/mocar/updateItem',
            method: 'get',
            params: params
        })
    },
    /**
     * 新增单条车辆资料
     * @param {*} params 
     * @returns 
     */
     addItem(params){
        return request({
            url: '/mocar/addItem',
            method: 'get',
            params: params
        })
    },
    /**
     * 查询出入库明细
     */
    getStoreIOList(query){
        return request({
            url: '/mocar/getStoreIOList',
            method: 'get',
            params: query
        })
    }
}

export default sm