import request from '@/utils/request'

const as = {
     /**
     * 获取整体任务统计数据
     */
      getAllTaskStatic(){
        return request({
            url: '/assessment/getAllTaskStatic',
            method: 'get',
        })
     },
     /**
     * 获取业务员任务统计数据
     */
      getStaffCompleteStatic(){
        return request({
            url: '/assessment/getStaffCompleteStatic',
            method: 'get',
        })
     },
}

export default as