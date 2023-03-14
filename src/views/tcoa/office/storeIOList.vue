<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px" v-if="showSearch">
         <el-form-item label="物品名称" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入物品名称"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="物品类别" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入物品类别"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
         </el-form-item>
      </el-form>
      <el-row :gutter="10" class="mb8">
         <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
            >导出</el-button>
         </el-col>
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!-- 表格数据 -->
      <el-table
         v-loading="loading"
         :data="itemList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
         @selection-change="handleSelectionChange"
      >
         <el-table-column label="序号" width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="物品名称" align="center" prop="itemName" :show-overflow-tooltip="true" />
         <el-table-column label="数量" align="center" prop="count" :show-overflow-tooltip="true" />
         <el-table-column label="原因" align="center" prop="appReason" :show-overflow-tooltip="true" />
         <el-table-column label="申请人" align="center" prop="appUser" :show-overflow-tooltip="true">
            <template #default="scope">
               <span>{{ matouFunc.renamebyCN(scope.row.appUser) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="操作类别" align="center" prop="actionType" :show-overflow-tooltip="true" />
         <el-table-column label="时间" align="center" prop="actionTime" :show-overflow-tooltip="true">
            <template #default="scope">
                  <span>{{ parseTime(scope.row.actionTime,'{m}月{d}日 {h}:{i}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="审批人" align="center" prop="actionUser" :show-overflow-tooltip="true" >
            <template #default="scope">
               <span>{{ matouFunc.renamebyCN(scope.row.actionUser) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="物品编号" align="center" prop="sn" :show-overflow-tooltip="true" />
         <el-table-column label="网点编号" align="center" prop="termID" :show-overflow-tooltip="true" />
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

   </div>
</template>
<script setup name="storeIOList">
import sm from "@/api/tcoa/office/storeManagement";
import matouFunc from "@/utils/matouFunc"
let showSearch = ref(false)
const { proxy } = getCurrentInstance();
const itemList = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(20);
const loading = ref(true);
const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
});


/** 查询仓库物品列表 */
function getList() {
  loading.value = true;
  sm.getStoreIOList(queryParams.value).then(response => {
    console.log(response)
    itemList.value = response.data;
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
  }, "仓库物品出入库明细.xlsx");
}
getList();
</script>
