<template>
   <div class="app-container">
      <!-- 表格数据 -->
      <el-table
         v-loading="loading"
         :data="agentlist.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
         @selection-change="handleSelectionChange"
      >
         <el-table-column label="序号" width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="业主" align="center" prop="name" :show-overflow-tooltip="true" />
         <el-table-column label="性别" align="center" prop="sex" :show-overflow-tooltip="true" />
         <el-table-column label="电话" align="left" prop="tel" :show-overflow-tooltip="true" />
         <el-table-column label="邮箱" align="left" prop="email" :show-overflow-tooltip="true" />
         <el-table-column label="生日" align="center" prop="birthday" :show-overflow-tooltip="true" />
         <el-table-column label="身份证" align="center" prop="idcard" :show-overflow-tooltip="true" />
         <el-table-column label="政治面貌" align="center" prop="political_status" :show-overflow-tooltip="true" />
         <el-table-column label="专长" align="center" prop="specialty" :show-overflow-tooltip="true" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

   </div>
</template>
<script setup>
import agent from "@/api/tcoa/retailshop/agent";
import { onBeforeMount, ref } from "vue";
const { proxy } = getCurrentInstance();
const agentlist = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(15);
const loading = ref(true);


/** 查询列表 */
function getList() {
  loading.value = true;
  agent.getList().then(response => {
    console.log(response)
    agentlist.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}



/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1;
  getList();
}
/** 重置搜索按钮操作 */
function resetQuery() {
  proxy.resetForm("storeIORef");
  handleQuery();
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("/mostore/exportIOList", {
    ...queryParams.value,
  }, "导出明细.xlsx");
}
onBeforeMount(()=>{
   getList();
})

</script>
