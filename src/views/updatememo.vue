<template>
  <div class="app-container home">
    
    <div style="margin-left:20px;margin-top:20px;margin-bottom:20px; width: 600px;" v-hasRole="['administrator']">
      
      <el-input v-model="updateContent.content" placeholder="请输入更新内容" />
      <el-input v-model="updateContent.color" type="color"/>
      <el-radio v-model="updateContent.hollow" label="1">hollow true</el-radio>
      <el-radio v-model="updateContent.hollow" label="0">hollow false</el-radio>
      <div>

        <el-button type="success" @click="submitfn">提交更新记录</el-button>
      </div>

    </div>
    <div style="margin-left:20px;">
      <el-alert title="更新说明" type="success" :closable="false" style="margin:20px auto;"  />
      <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple" />
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activitie"
              :key="index"
              :type="activity.type"
              :color="activity.color"
              :size="activity.size"
              :hollow="activity.hollow?true:false"
              :timestamp="parseTime(activity.timestamp)"
            >
              {{ activity.content }}
            </el-timeline-item>
          </el-timeline>
        </el-col>
        <el-col :span="8"><div class="grid-content bg-purple" /></el-col>
      </el-row>
    </div>

    
  </div>
</template>

<script setup name="Index">
import { reactive } from 'vue-demi'
import updatefns from "@/api/tcoa/codeupdate/updatecontent"
import { parseTime } from '../utils/ruoyi';
const updateContent = reactive({
  content:'',
  timestamp:Date.now(),
  hollow:"1",
  color:""
})
const activitie = ref([])
  
const getList = ()=>{
  updatefns.getAllUpdates().then((res)=>{
    console.log(res)
    activitie.value = res.data
  })
}
const submitfn = ()=>{
  if(updateContent.content){
    updatefns.addupdateContent(updateContent).then((res)=>{
      getList()
    })
  }else{
    alert("请输入内容")
  }
}
getList()
  
</script>

<style scoped lang="scss">
.demo-type {
  margin-top: 15px;
  display: flex;
}
.demo-type > div {
  flex: 1;
  text-align: center;
}

.demo-type > div:not(:last-child) {
  border-right: 1px solid var(--el-border-color-base);
}
.pename {
  font-size: 14px;
  color: var(--el-text-color-secondary);}
.pename:hover{
  border:1px rgb(44, 8, 250) solid;
  font-size: 16px;
  padding: 0 8px;
  margin:0,0;
}
div{
  padding:0px;
  margin: 0;
}
</style>

