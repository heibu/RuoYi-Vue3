<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          流程清单
        </blockquote>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>我待办的任务</span>
            </div>
          </template>
          <div class="body">
            <el-table :data="taskList"  border style="width: 100%">
              <el-table-column type="index" width="50" label="序号"/>
              <el-table-column prop="workTeam" label="项目组" />
              <el-table-column prop="creator" sortable label="发起人" width="90">
                <template #default="scope">
                     <span>{{ matouFunc.renamebyCN(scope.row.creator) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="creatTime" label="发起" sortable  width="160">
                <template #default="scope">
                     <span>{{ parseTime(scope.row.creatTime,'{m}月{d}日 {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="cate" sortable label="流程类别" width="180" />
              <el-table-column prop="work" label="工作项目" width="300" />
              <el-table-column prop="zhixing" label="执行人" sortable  width="90">
                <template #default="scope">
                     <span>{{ matouFunc.renamebyCN(scope.row.zhixing) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="taskName" label="当前环节" width="180" />
              <el-table-column prop="startTime" label="任务达到" sortable  width="160">
                <template #default="scope">
                     <span>{{ parseTime(scope.row.startTime,'{m}月{d}日 {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="deadline" label="任务截止" sortable  width="160">
                <template #default="scope">
                     <span>{{scope.row.deadline>scope.row.startTime?parseTime(scope.row.deadline,'{m}月{d}日 {h}:{i}')||"未设置":scope.row.deadline?"[逾期]"+parseTime(scope.row.deadline,'{m}月{d}日 {h}:{i}'):"未设置" }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                  <template #default="scope">
                        <el-button @click="getHighLightNodes(scope.row)" size="small">详情</el-button>
                        <el-button @click="handleComplete(scope.row)"  size="small">处理</el-button>
                  </template>
               </el-table-column>
            </el-table>
            <el-pagination 
              small background
              v-show="total > 0"
              :total="total" 
              layout="total, prev, pager, next,sizes"
              v-model:currentPage="queryParams.pageNum"
              v-model:page-size="queryParams.pageSize"
              @current-change="getinfo"
              @size-change="getinfo"
              class="mt-4" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 完成任务对话框 -->
    <el-dialog :title="完成当前任务" :close-on-click-modal="false" @close="rdata=[]" :fullscreen="false" center v-model="open" width=80% append-to-body>
        <h3 style="text-align:center">任务标题：{{taskinfos.taskName}}</h3>
        <el-row :gutter="12" style="margin-bottom:15px">
          <el-col :span="24">
            <el-card shadow="always">工作内容：{{taskinfos.taskDesc}} </el-card>
          </el-col>
        </el-row>
        
        <el-row :gutter="12" style="margin:25px auto">
          <el-col :span="24">
            <el-card shadow="always"> 
              <template #header>
                <div class="card-header">
                  {{auditFormRule}}
                  <el-icon :size="20" class="is-loading"><edit /></el-icon>我的审批
                </div>
                <!-- {{formData}} -->
              </template>
              <VueForm v-model="formData" ref="myauditRef" :error-schema="errorSchema" :ui-schema="uiSchema" :form-footer="formFooter" :schema="schema" @cancel="backPrev" @submit="handlerSubmit">
                  <template v-slot="{}">
                      <el-button @click="backToStart" type="danger">退回到开始</el-button>
                      <el-button type="warning" @click="backPrev">退回上一步</el-button>
                      <el-button type="success" @click="handlerSubmit">提交</el-button>
                  </template>
              </VueForm>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="12" style="margin:25px auto">
          <el-col :span="24">
            <el-card shadow="always"> 
              <template #header>
                <div class="card-header">
                  <el-icon :size="20" ><EditPen /></el-icon>审批历史
                </div>
              </template>
              <el-table :data="comments" >
              <el-table-column label="审批环节" align="center" prop="taskName" />
              <el-table-column label="审批人" align="center" prop="assignee">
                <template #default="scope">
                      <span>{{ matouFunc.renamebyCN(scope.row.assignee) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="审批意见" align="center" prop="comment" />
              <el-table-column label="到达时间" align="center" prop="startTime">
                <template #default="scope">
                      <span>{{ parseTime(scope.row.startTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束时间" align="center" prop="endTime">
                <template #default="scope">
                    <span>{{ parseTime(scope.row.endTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="审批用时" align="center" prop="duration">
                <template #default="scope">
                    <span>{{ matouFunc.timeStampToDhms(scope.row.duration) }}</span>
                </template>
              </el-table-column>
            </el-table>
            </el-card>
          </el-col>
        </el-row>
      
        <div v-for="form in rdata" :key="form">
          <el-row :gutter="12" style="margin-bottom:25px;">
            <el-col :span="24">
              <el-card shadow="always"> 
                <VueForm v-model="r" :schema="form.schema" :aria-readonly="true" :form-footer="rfooter" />  
              </el-card>
              <el-card>
                <el-row>
                  <el-col :span="8"><div class="grid-content bg-purple" /><el-tag>任务环节：</el-tag>{{form.data.taskName}}</el-col>
                  <el-col :span="8"><div class="grid-content bg-purple-light" /><el-tag>审批人：</el-tag>{{matouFunc.renamebyCN(form.data.assignee)}}</el-col>
                  <el-col :span="8"><div class="grid-content bg-purple" /><el-tag>审批时间：</el-tag>{{ parseTime(form.data.endTime) }}</el-col>
                </el-row>
              </el-card>
            </el-col>
          </el-row>
        </div>
        <el-diver></el-diver>
      </el-dialog>
  </div>
</template>

<script setup name="Index">
import tools from "@/api/workflow/tools";
import ins from "@/api/camunda/ins";
import bpmnapi from "@/api/camunda/bpmn";
import workflowTask from "@/api/workflow/task";
import { useRouter } from 'vue-router';
import VueForm from '@lljj/vue3-form-element';
import matouFunc from "@/utils/matouFunc"
import { reactive, ref } from "vue-demi";
import {cosUpload,cosSingleDel} from '@/utils/uploadCos'
// import "../plugins/camunda-formjssdk/camunda-bpm-sdk"
// import "../plugins/camunda-formjssdk/jquery"

const open = ref(false);
const taskinfos = reactive({
  taskId : "",
  actId:"",
  defId:"",
  insId : "",
  taskName:"",
  taskDesc:""
})
const queryParams = reactive({
  pageNum: 1,
  pageSize: 30,
})
const total = ref(0)
const schema = ref()
const errorSchema = ref()
const uiSchema = ref({
  "attachment":{
    "ui:on-change":(file,fileList)=>uploadChange(file,fileList),
    "ui:onChange":(file)=>uploadOnRemove(file),
  }
})
const formData = ref({})
const formFooter = ref()
const taskList = ref([])
const comments = ref([])
// const store = useStore();
// const getters = computed(() => store.getters).value;
const { proxy } = getCurrentInstance()
const router = useRouter();
const uploadpicTypes = '.jpg,.png'
const r = ref()
const rdata = ref([])
const rfooter = ref({
    "show": false
})

/**
 * 获取所有我的待办任务
 */
function getinfo(){
  // userinfo.username=getters.name
  console.log(matouFunc.renamebyCN("shijincai"))
  tools.getAllMyTask({pageNum:queryParams.pageNum,pageSize:queryParams.pageSize}).then((res)=>{
    console.log(res)
    taskList.value = res.data
    total.value = res.total
  })
}
/**
 * 根据formkey列表，查询相应的schema
 * 必须将for\foreach循环包装成函数，才能获取同步结果
 */
async function getSchemeByFormkeyArray(formData){
  for( var n=0; n< formData.length;n++){
    if(formData[n].formKey){
      await tools.getTaskFormData(formData[n].formKey).then(rr=>{
        rdata.value.push({formkey:formData[n].formKey,schema:rr.schema,data:formData[n]})
      })
    }
  }
}

/**获取comments */
function getComments(insId){
  ins.getCommentsByinsId({insId}).then(res=>{
    console.log(res)
    comments.value = res.data
  })
}

/**
 * 打开处理当前任务窗口，获取任务表单信息
 */
async function handleComplete(row){
  getComments(row.insId)
  //当前任务环节formkey
  let formKey = await bpmnapi.getFormKeyById({defId:row.defId,actId:row.actId})
  tools.getTaskFormData(formKey).then(res=>{
    if(res){
      taskinfos.taskId = row.taskId
      taskinfos.actId = row.actId
      taskinfos.defId = row.defId
      taskinfos.insId = row.insId
      taskinfos.taskName = row.taskName
      taskinfos.taskDesc = row.work
      // console.log("res:"+JSON.stringify(res))
      // console.log("taskinfos:"+JSON.stringify(taskinfos))

      workflowTask.getTaskVarList({taskId:row.taskId, insId:row.insId,defId:row.defId }).then(ress=>{
        r.value=ress.var
        if(ress.formData!=""){
          //根据返回的formkey列表，查询相应的schema 
          console.log(ress)
          getSchemeByFormkeyArray(ress.formData)
        }
      })
      schema.value = res.schema
      formFooter.value = res.formFooter 
      errorSchema.value =res.errorSchema
      open.value = true
    }
  }).catch(e=>{
    console.log(e)
  });
}
/**
 * 提交并完成当前任务
 */
function handlerSubmit(){
  // console.log(proxy.$refs["auditFormRef"].$$uiFormRef)
    proxy.$refs["myauditRef"].$$uiFormRef.validate(valid=>{
      if(valid){
        let taskinfo = {insId:taskinfos.insId,taskId:taskinfos.taskId,variables:formData.value}
        console.log(formData.value)
        workflowTask.completeTaskById(taskinfo).then((res)=>{
          // var message = "后台任务处理完毕"
          // proxy.$message.success(message)
          getinfo();
        });
        open.value = false
        formData.value={}
        schema.value={}
      }else{
        console.log(valid)
      }
    })
}

/**
 * 取消提交
 */
function cancel(){
    proxy.open = false
    const e = document.getElementById('dialogs');
    var child = e.lastElementChild;  
        while (child) { 
            e.removeChild(child); 
            child = e.lastElementChild; 
        }
}
/**
 * 获取高亮历史详情
 */
function getHighLightNodes(row){
  console.log(row)
  router.push({ path: '/bpmn/historyView', query: { insId: row.insId,procDefId:row.defId }})
}
/**
 * 流程退回上一步
 */
async function backPrev(){
    let idinfo = {variables:formData.value,taskId:taskinfos.taskId,insId:taskinfos.insId,defId:taskinfos.defId,actId:taskinfos.actId}
    console.log(idinfo)
    tools.rejectInstanceById(idinfo).then(res=>{
      console.log(res)
      if(res==3){
        proxy.$message.error("流程第一步无法退回")
      }else{
        getinfo();
        proxy.$message.success("流程已退回上一步")
      }
    });
    open.value = false
    formData.value={}
    schema.value={}
}
/**
 * 流程退回到开始
 */
async function backToStart(){
    let idinfo = {variables:formData.value,taskId:taskinfos.taskId,insId:taskinfos.insId,defId:taskinfos.defId,actId:taskinfos.actId}
    console.log(idinfo)
    tools.backToStart(idinfo).then(res=>{
      console.log(res)
      if(res==3){
        proxy.$message.error("流程第一步无法退回")
      }else{
        getinfo();
        proxy.$message.success("流程已退回到开始")
      }
    });
    open.value = false
    formData.value={}
    schema.value={}
}
//上传图片触发函数
async function uploadChange(file,fileList){
    document.getElementsByClassName('el-upload')[0].style.display="none"
    if (!file.name) {
       proxy.$message({
            message: '未发现文件，请重新选择',
            type: 'warning',
        });
    } else {
       checkfile(file)
    }
}
function uploadOnRemove(file){
  console.log("file")
  console.info(file)
    //todo cos删除文件
    document.getElementsByClassName('el-upload')[0].style.display="block"
    var filename = file.preVal.substring(file.preVal.lastIndexOf('/')+1);
    cosSingleDel(filename)
}
// 上传前校验
async function checkfile(file) {
    var testmsg = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    let uploadpicTypesArr = uploadpicTypes.split(',');
    // 判断文件是否符合要求
    if (uploadpicTypesArr.indexOf(testmsg) < 0) {
       proxy.$message({
            message: '上传文件只能是' +uploadpicTypes + '格式!',
            type: 'warning',
        });
        return false;
    } else if (file.size / 1024 / 1024 > 10) {
       proxy.$message({
            message: '上传文件过大，大小不可超过10M!',
            type: 'warning',
        });
        return false;
    } else {
        cosUpload(file,res => {
            // 有返回值也就是res存在，就代表uploadCos.js文件里的             
            // --> callback(fileUrl)中的fileUrl存在，也就是说data有值，即上传成功。
            if(res){
               proxy.$message.success('上传成功')
            }
            console.log("res:"+res)
            formData.value.attachment="https://"+res
        })
    }
}
getinfo()
</script>

<style lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.el-upload{
  height: 146px;
  width: 146px;
  background-image: url("/src/assets/images/profile.jpg");
  background-size:100% 100%;
  background-color: rgb(175, 220, 247);
}
.el-upload>button{
    background-color: rgba(0, 0, 0, .2);
    width: 100%;
    height: 30px;
    margin-top: 75px;
}
</style>

