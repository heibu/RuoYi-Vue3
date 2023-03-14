
import { ElNotification } from 'element-plus'
const matouFunc = {
  //ElMessage-box
  open(title="操作成功",message,showClose=false) {
      ElNotification.success({
        title: title,
        message: message,
        showClose: showClose,
      })
  },
  //递归清除dialog表单填充内容
  clearDialog(dialogId){
    const e = document.getElementById(dialogId);
    var child = e.lastElementChild;  
        while (child) { 
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
  },
  /**
   * 替换英语姓名
   */
  renamebyCN(name){
      let namearr = new Map()
      namearr.set("shijincai","时金才")
      namearr.set("lichaofeng","李超锋")
      namearr.set("cuiguoliang","崔国亮")
      namearr.set("weichunjie","魏春杰")
      namearr.set("sutianzhen","苏天真")
      namearr.set("chenwu","陈伍")
      namearr.set("zhangmingliang","张明亮")
      namearr.set("xiaxindong","夏欣冬")
      namearr.set("cuiwei","崔威")
      namearr.set("yinwanjie","殷琬洁")
      namearr.set("dongxin","董鑫")
      namearr.set("wangqinbo","王勤博")
      namearr.set("liubo","刘波")
      namearr.set("xuxiangfu","徐祥府")
      namearr.set("shasha","沙莎")
      namearr.set("liujunwei","刘军伟")
      namearr.set("liguang","李广")
      namearr.set("aihaitao","艾海涛")
      return namearr.get(name)
  },
  /**
   * 将微秒转为时间段 x天X小时X分
   */
   timeStampToDhms(milseconds){
     let inday = 1000*60*60*24;
     let inhour = 1000*60*60;
     let inminute = 1000*60;
     let day = Math.floor(milseconds/inday)
     if(day>0) {var days = day+"天"}else{var days =""}
     let hour = Math.floor((milseconds-inday*day)/inhour)
     if(hour>0) {var hours = hour+"时"}else{var hours =""}
     let minute = Math.floor((milseconds-inday*day-inhour*hour)/inminute)
     if(minute>0) {var minutes = minute+"分"}else{var minutes =""}
     if(milseconds/1000<60){return Math.floor(milseconds/1000)+"秒"}
     return days+hours+minutes;
   }
}

export default matouFunc