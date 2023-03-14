import request from '@/utils/request'

const gt = {
    /**
     * 获取所有工作甘特数据
     */
    getAllTaskGante(){
        return request({
            url: '/gante/getAllTaskGante',
            method: 'get',
        })
    },
    /**根据用户名获取工作任务甘特数据 */
    getTaskGanteByUsername(params){
        return request({
            url: '/gante/getTaskGanteByUsername',
            method: 'get',
            params:params
        })
    },
    /**根据小组获取工作计划甘特数据 */
    getPlanGanteByWorkteam(params){
        return request({
        url: '/gante/getPlanGanteByWorkteam',
        method: 'get',
        params:params
        })
    },
    /**
     * 获取所有计划甘特数据
     */
     getAllPlanGante(){
        return request({
            url: '/gante/getAllPlanGante',
            method: 'get',
        })
    },

}

export default gt