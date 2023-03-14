import request from '@/utils/request'

const wxtool = {
  
  wxTextNotice(noticeForm){
    return request({
        url: '/sendnotice/wxTextNotice',
        method: 'post',
        data:noticeForm
    })
  },
  getwxid(username){
    return request({
      url: '/user/getonewxid',
      method: 'get',
      params:username

    })
  }
}

export default wxtool