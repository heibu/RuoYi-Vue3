import request from '@/utils/request'

const workflowTask = {
  /**
   * 根据用户id 查询个人任务
   * @param {*} username 
   * @returns 
   */
  getTaskByUsername(userinfo) {
    return request({
      url: '/camunda/getTaskByUsername',
      method: "get",
      params: userinfo
    })
  },
  getTaskByTeam(teamInfo){
    return request({
      url: '/camunda/getTaskByTeam',
      method: "get",
      params: teamInfo
    })
  },
  // 根据任务id，完成任务
  completeTaskById(taskinfo) {
    return request({
      url: '/camunda/completeTaskById',
      header: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      method: 'post',
      data: taskinfo
    })
  },
  // 查询我办理的流程列表
  getInvolvedTask(params) {
    return request({
      url: '/camunda/involvedTask',
      method: 'get',
      params: params
    })
  },
  /**根据jobId获取任务详情 */
  getWorkDetailByworkID(p){
    return request({
      url: '/camunda/getWorkDetailByworkID',
      method: 'get',
      params: p
    })
  },
  //根据taskid获取任务内容明细，所有变量
  getTaskVarList(taskinfo){
    return request({
      url: '/camunda/getTaskVarList',
      method: 'get',
      params: taskinfo
    })
  },
  //对小组工作加权置顶
  plusJobWeight(taskinfo){
    return request({
      url: '/camunda/plusJobWeight',
      method: 'get',
      params: taskinfo
    })
  },
  //对个人task id加权置顶
  plusJobWeightByusertaskID(taskinfo){
    return request({
      url: '/camunda/plusJobWeightByusertaskID',
      method: 'get',
      params: taskinfo
    })
  }

  // // 查询表单
  // export function formDataShow(taskID) {
  //   return request({
  //     url: '/task/formDataShow/'+taskID,
  //     method: 'get',
  //   })
  // }

  // // 查询表单
  // export function formDataSave(taskID,data) {
  //   return request({
  //     url: '/task/formDataSave/'+taskID,
  //     method: 'post',
  //     data:data
  //   })
  // }
}

export default workflowTask
