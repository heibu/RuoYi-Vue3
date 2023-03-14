import request from '@/utils/request'

const tools = {
    /**
     * 部署bpmn对象
     * @param {object} bpmnModeler bpmn对象
     */
    processDeployment(processInfo) {
        return request({
            url: '/camunda/addDeploymentByString',
            method: 'post',
            data: processInfo
          })
    },
    /**
 * 获取bpmnXML
 */
    getBpmnXml(params){
    return request({
        url: '/camunda/bpmn/getBpmnByInsId',
        method: 'get',
        params: params
    })
    },
    // /**
    //  * 获取我的待办列表 
    //  */
    // getMytask(userinfo){
    //     return request({
    //         url: '/camunda/mytask',
    //         method: 'get',
    //         params: userinfo
    //     })
    // },
    /**
     * 获取我的所有待办列表 取代 getmytask()
     */
     getAllMyTask(userinfo){
        return request({
            url: '/camunda/getAllMyTask',
            method: 'get',
            params: userinfo
        })
    },
    /**
     * 获取我的待审核列表（非待办）
     */
     getMyCheck(userinfo){
        return request({
            url: '/camunda/getMyCheck',
            method: 'get',
            params: userinfo
        })
    },
    //获取所有流程模板
    getModels(userinfo){
    return request({
        url: '/camunda/getAllProcessModels',
        method: 'get',
        params: userinfo
    })
    },
    //根据definitionID发起流程
    startProcessInstanceById(idinfo) {
        return request({
            url: '/camunda/startProcessInstanceById',
            header: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
            },
            method: 'post',
            data: idinfo
        })
    },
    //根据defKey发起流程
    startInsByDefKey(definfo) {
        return request({
            url: '/camunda/startInsByDefKey',
            header: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
            },
            method: 'post',
            data: definfo
        })
    },
    //根据definitionId获取StartFormData
    // getStartFormData(startFormDefId){
    //     return request({
    //         url: '/camunda/getStartForm',
    //         method: 'get',
    //         params: startFormDefId
    //     })
    // },
    //根据formKey(schema地址）获取FormData
    getTaskFormData(formKey){
        return request({
            url: formKey,
            method: 'get',
        })
    },
    //根据defId删除流程定义
    deleteDefByID(defId){
        return request({
            url: '/camunda/deleteDefByID',
            method: 'get',
            params: defId
        })
    }
    ,
    /**
     * 获取start formkey,用于发起流程表单
     */
     getFormKeyByDefID(params){
        return request({
            url: '/camunda/api/getFormKeyByDefId',
            method: 'get',
            params: params
        })
    },
    /**
     * 获取start formkey,用于发起流程表单
     */
    getFormKeyByDefKey(params){
        return request({
            url: '/camunda/api/getFormKeyByDefKey',
            method: 'get',
            params: params
        })
    },
    /**
     * 删除流程实例
     */
     delInsByInsId(params){
        return request({
            url: '/camunda/cancelProcess',
            method: 'get',
            params: params
        })
    },
    /**
     * 流程退回上一步
     */
     rejectInstanceById(idinfo){
        return request({
            url: '/camunda/rejectInstanceById',
            header: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            data: idinfo
        })
     },
      /**
     * 流程退回到开始
     */
       backToStart(idinfo){
        return request({
            url: '/camunda/backToStart',
            header: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            data: idinfo
        })
     },
     /**
      * 获取所有实例列表
      */
      getPorcInsList(info){
        return request({
            url: '/camunda/getPorcInsList',
            method: 'get',
            params: info
        })
     },
     /**
      * 获取所有固定工作def
      */
      getAllRegularjob(){
        return request({
            url: '/test/getAllRegularjob',
            method: 'get',
        })
     },
}

export default tools