import request from '@/utils/request'

const sendnotice = {
     /**
     * 发送通知
     */
      rspointsNotice(params){
        return request({
          url: '/sendnotice/rspointsNotice',
          method: 'post',
          data: params
      })
     },
}

export default sendnotice