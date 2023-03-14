<template>
   <div class="app-container">
      <el-table :data="tasks.value" style="width: 100%">
         <el-table-column label="流程内容" align="left" prop="description" />
      
         <el-table-column label="当前环节" align="center" prop="name" width="200" />
         <el-table-column label="接到" align="center" sortable  prop="startTime" width="120">
            <template #default="scope">
               <span>{{ parseTime(scope.row.startTime, '{m}-{d}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="办理" align="center" sortable  prop="endTime" width="120">
            <template #default="scope">
               <span>{{ parseTime(scope.row.endTime, '{m}-{d}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
               <el-button @click="getHighLightNodes(scope.row)" >查看详情</el-button>
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
         @current-change="gettask"
         @size-change="gettask"
         class="mt-4" />
  </div>
</template>

<script setup name="involved">
import workflowTask from "@/api/workflow/task"
import { reactive } from "vue"
import { useRouter } from 'vue-router';
const router = useRouter();
const total = ref(0)
const tasks = reactive([])
const queryParams = reactive({
   pageNum: 1,
   pageSize: 10,
})
function gettask(){
   workflowTask.getInvolvedTask(queryParams).then(res=>{
   console.log(res)
      tasks.value = res.data
      total.value = res.total
   })
}
/**
 * 获取高亮历史详情
 */
function getHighLightNodes(row){
  console.log(row)
  router.push({ path: '/bpmn/historyView', query: { insId: row.processInstanceId,procDefId:row.processDefinitionId }})
}
gettask()
</script>

<style>

</style>