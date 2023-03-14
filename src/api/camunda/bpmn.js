import request from '@/utils/request'

const bpmnapi = {
    
    /** */
    getFormKeyById(params){
        return request({
            url: '/camunda/bpmn/getFormKeyById',
            method: 'get',
            params:params
        })
    },
    
}

export default bpmnapi