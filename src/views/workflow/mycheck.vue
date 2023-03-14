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
      <el-col :sm="24" :lg="24">
        <div id="formContainer"></div>
          <div id="form">
        
          </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col>
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>待我审核</span>
            </div>
          </template>
          <div class="body">
            <el-table :data="taskList"  border style="width: 100%">
              <el-table-column type="index" width="50" label="序号"/>
              <el-table-column prop="zhixing" label="发起人" sortable  width="150">
                <template #default="scope">
                     <span>{{ matouFunc.renamebyCN(scope.row.zhixing) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="流程描述" width="600" />
              <el-table-column prop="bpmnNameSpace" sortable label="流程类别" width="160" />
              <el-table-column prop="taskName" label="环节" width="180" />
              <!-- <el-table-column prop="owner" label="责任人" /> -->
              <!-- <el-table-column prop="startTime" label="任务开始" sortable  width="160">
                <template #default="scope">
                     <span>{{ parseTime(scope.row.startTime,'{m}月{d}日 {h}:{i}') }}</span>
                </template>
              </el-table-column> -->
              <el-table-column prop="dueDate" label="截止时间" sortable  width="160">
                <template #default="scope">
                     <span>{{ parseTime(scope.row.dueDate,'{m}月{d}日 {h}:{i}') }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="taskName" label="待办环节" width="160"/> -->
              <el-table-column label="查看" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-button @click="getHighLightNodes(scope.row)" size="small">详情</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
                  <template #default="scope">
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
                  <el-icon :size="20" class="is-loading"><edit /></el-icon>我的审批
                </div>
              </template>
              <VueForm v-model="formData" :form-footer="formFooter" :schema="schema" @cancel="backPrev" @submit="handlerSubmit" />
            </el-card>
          </el-col>
        </el-row>
        <div v-for="form in rdata" :key="form">
          <el-row :gutter="12" style="margin-bottom:15px">
            <el-col :span="24">
              <el-card></el-card>
              <el-card shadow="always"> 
                <VueForm v-model="r" :schema="form.schema" :disabled="true" :form-footer="rfooter" />  
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
import workflowTask from "@/api/workflow/task";
import { useRouter } from 'vue-router';
import VueForm from '@lljj/vue3-form-element';
import matouFunc from "@/utils/matouFunc"
import { reactive, ref } from "vue-demi";
// import "../plugins/camunda-formjssdk/camunda-bpm-sdk"
// import "../plugins/camunda-formjssdk/jquery"

const open = ref(false);
const taskinfos = reactive({
  taskId : "",
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
const formData = ref({})
const formFooter = ref()
const taskList = ref([])
// const store = useStore();
// const getters = computed(() => store.getters).value;
const { proxy } = getCurrentInstance()
const router = useRouter();
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
  tools.getMyCheckTask({pageNum:queryParams.pageNum,pageSize:queryParams.pageSize}).then((res)=>{
    console.log(res)
    taskList.value = res.data
    total.value = res.total
  })
}
/**
 * 根据formkey列表，查询相应的schema
 * 必选将for\foreach循环包装成函数，才能获取同步结果
 */
async function getSchemeByFormkeyArray(keyarr){
  for( var n=0; n< keyarr.length;n++){
    await tools.getTaskFormData(keyarr[n]).then(rr=>{
      rdata.value.push({formkey:keyarr[n],schema:rr.schema})
    })
  }
}

/**
 * 打开处理当前任务窗口，获取任务表单信息
 */
function handleComplete(row){
  tools.getTaskFormData(row.formKey).then(res=>{
    if(res){
      taskinfos.taskId = row.taskId
      taskinfos.insId = row.processInstanceId
      taskinfos.taskName = row.taskName
      taskinfos.taskDesc = row.description
      // console.log("res:"+JSON.stringify(res))
      // console.log("taskinfos:"+JSON.stringify(taskinfos))

      workflowTask.getTaskVarList({taskId:row.taskId, insId:row.processInstanceId }).then(ress=>{
        r.value=ress.var
        if(ress.formkey!=""){
          //根据返回的formkey列表，查询相应的schema
          console.log(ress.formkey) 
          getSchemeByFormkeyArray(ress.formkey)
        }
      })
      
      schema.value = res.schema
      formFooter.value = res.formFooter 
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
    let taskinfo = {insId:taskinfos.insId,taskId:taskinfos.taskId,variables:formData.value}
    console.log(formData)
    workflowTask.completeTaskById(taskinfo).then((res)=>{
      open.value = false
      // proxy.$refs["formschema"].resetFields()
      var message = "任务处理完毕"
      proxy.$message.success(message)
      getinfo();
    });
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
  router.push({ path: '/bpmn/historyView', query: { insId: row.processInstanceId,procDefId:row.procDefId }})
}
/**
 * 流程退回上一步
 */
async function backPrev(row){
    proxy.$message.success("当前驳回功能处于测试阶段，有问题请及时反馈")
    let idinfo = {variables:formData.value,taskId:taskinfos.taskId}
    console.log(idinfo)
    await tools.rejectInstanceById(idinfo).then(res=>{
      console.log(res)
      open.value = false
      getinfo();
      proxy.$message.success("流程已退回")
      // window.close()
    });
}

getinfo()
</script>

<style scoped lang="scss">
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
</style>

