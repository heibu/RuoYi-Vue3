import request from '@/utils/request'

const user = {
     /**
     * 获取人员数据
     */
      getUserList(){
        return request({
            url: '/user/getUserList',
            method: 'get',
        })
     },


}

export default user