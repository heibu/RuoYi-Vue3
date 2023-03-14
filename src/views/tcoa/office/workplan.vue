<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
         <el-form-item label="计划名称" prop="ipaddr">
            <el-input
               v-model="queryParams.ipaddr"
               placeholder="请输入计划名称"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <el-form-item label="项目组" prop="userName">
            <el-input
               v-model="queryParams.userName"
               placeholder="请输入项目组"
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
               type="primary"
               plain
               icon="Plus"
               @click="handleAdd"
            >新增</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="success"
               plain
               icon="Edit"
               :disabled="single"
               @click="handleUpdate"
               v-hasPermi="['system:role:edit']"
            >修改</el-button>
         </el-col>
         <el-col :span="1.5">
            <el-button
               type="danger"
               plain
               icon="Delete"
               :disabled="multiple"
               @click="handleDelete"
               v-hasPermi="['system:role:remove']"
            >删除</el-button>
         </el-col>
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
      <!-- 明细表格 -->

      <el-table
         v-loading="loading"
         :data="itemList.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
         @selection-change="handleSelectionChange"
      >
         <el-table-column type="selection" width="55" align="center" v-hasPermi="['system:role:remove']" />
         <el-table-column label="序号" width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="计划名称" align="center" width="200" prop="title" :show-overflow-tooltip="true" />
         <el-table-column label="计划内容" align="center" prop="content" :show-overflow-tooltip="true" />
         <el-table-column label="责任人" align="center" prop="tracker" :show-overflow-tooltip="true" />
         <el-table-column label="项目组" align="center" prop="workteam" :show-overflow-tooltip="true" />
         <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true" />
         <el-table-column label="起始时间" align="center" prop="start" :show-overflow-tooltip="true">
            <template #default="scope">
               <span>{{ parseTime(scope.row.start,'{m}月{d}日 {h}:{i}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="截止时间" align="center" prop="end" :show-overflow-tooltip="true">
            <template #default="scope">
               <span>{{ parseTime(scope.row.end,'{m}月{d}日 {h}:{i}') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="预算" align="center" prop="budget" :show-overflow-tooltip="true" />
         <el-table-column label="支出" align="center" prop="expenditure" :show-overflow-tooltip="true" />
         <el-table-column label="预算分类" align="center" prop="budgetcate" :show-overflow-tooltip="true" />
      </el-table>
      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

      <!-- 新增/更新 对话框 -->
      <el-dialog :title="title" v-model="editFormOpen" width="80%" append-to-body>
         <el-form ref="editFormRef" :model="editform" :rules="editFormRules" label-width="auto">
            <el-form-item label="计划名称" prop="title">
               <el-input v-model="editform.title" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item label="计划内容" prop="content">
                <el-input type="textarea" :rows="3" v-model="editform.content" placeholder="请输入计划内容"/>
            </el-form-item>
            <el-form-item label="责任人" prop="tracker">
               <el-radio-group v-model="editform.tracker" size="small" v-for="user,index in userList" :key="index">
                  <el-radio-button :label="user.user_name">{{user.nick_name}}</el-radio-button>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="项目组" prop="workteam">
               <el-radio-group v-model="editform.workteam" size="small">
                  <el-radio-button label="概率组" />
                  <el-radio-button label="竞猜组" />
                  <el-radio-button label="即开组" />
                  <el-radio-button label="公关组" />
                  <el-radio-button label="渠道组" />
                  <el-radio-button label="责任彩票组" />
                  <el-radio-button label="督导组" />
               </el-radio-group>
            </el-form-item>
            <el-form-item label="计划状态" prop="status">
                <el-radio-group v-model="editform.status" size="small">
                  <el-radio-button label="待执行" />
                  <el-radio-button label="已执行" />
                  <el-radio-button label="已取消" />
               </el-radio-group>
            </el-form-item>
            <el-form-item label="计划起始时间" prop="start">
                <el-date-picker v-model="editform.start" type="datetime" placeholder="计划起始时间" />
            </el-form-item>
            <el-form-item label="计划截止时间" prop="end">
                <el-date-picker v-model="editform.end" type="datetime" placeholder="计划起始时间" />
            </el-form-item>
            <el-form-item label="预算分类" prop="budgetcate">
               <el-radio-group v-model="editform.budgetcate" size="small">
                  <el-radio-button label="促销" />
                  <el-radio-button label="拉新" />
                  <el-radio-button label="奖励" />
                  <el-radio-button label="宣传" />
                  <el-radio-button label="培训" />
                  <el-radio-button label="其他" />
               </el-radio-group>
            </el-form-item>
            <el-form-item label="预算金额" prop="budget">
                <el-input-number :precision="2" v-model="editform.budget" style="width:200px;" placeholder="请输入预算金额"/>
            </el-form-item>
            <el-form-item label="支出金额" prop="expenditure">
                <el-input-number :precision="2" v-model="editform.expenditure" style="width:200px;" placeholder="请输入支出金额"/>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submit">提 交</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>
<script setup name="workplan">
import wp from "@/api/tcoa/office/workplan";
import user from "@/api/tcoa/office/user";
const { proxy } = getCurrentInstance();
const loading = ref(true);
const itemList = ref([]);
const userList = ref([])
const total = ref(0);
const ids = ref([]);
const pageNum = ref(1);
const pageSize = ref(30);
const title = ref("");
const single = ref(true);
const multiple = ref(true);
const editFormOpen = ref(false);
const editform = ref({})
/**编辑/新增 对话框验证 */
const editFormRules = ref({
   title: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
   content: [{ required: true, message: '请输入计划内容', trigger: 'blur' }],
   tracker: [{ required: true, message: '请输入责任人', trigger: 'blur' }],
   workteam: [{ required: true, message: '请输入项目组', trigger: 'blur' }],
   status: [{ required: true, message: '请确认计划状态', trigger: 'blur' }],
   start: [{ required: true, message: '请确认计划开始时间', trigger: 'blur' }],
   end: [{ required: true, message: '请确认计划截止时间', trigger: 'blur' }],
   status: [{ required: true, message: '请确认计划状态', trigger: 'blur' }],
})
const queryParams = ref({
   ipaddr: undefined,
   userName: undefined
});
//初始化函数，获取所有工作计划数据
function init(){
   loading.value = true;
   wp.getWorkplanList(queryParams.value).then(res=>{
      itemList.value = res.data;
      total.value = res.total;
      loading.value = false;
   })
}
/** 打开添加对话框 */
function handleAdd() {
  editFormOpen.value = true;
  title.value = "添加工作计划";
}

/** 打开编辑对话框 */
function handleUpdate() {
  const itemId = ids.value;
  wp.getItemDetail({id:itemId[0]}).then(response => {
     console.log(response)
      title.value = "修改工作计划";  
      editform.value = response;
      editFormOpen.value = true;
  });
}
/** 取消编辑按钮 */
function cancel() {
  editFormOpen.value = false;
  editform.value = {};
  proxy.resetForm("editFormRef");
}
/** 删除按钮 */
function handleDelete() {
  const itemIds = ids.value;
  proxy.$modal.confirm('是否确认删除编号为"' + itemIds + '"的数据项?').then(function () {
    return wp.delPlan(itemIds);
  }).then(() => {
    init()
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}
/** 提交新增/编辑 */
function submit() {
  proxy.$refs["editFormRef"].validate(valid => {
    if (valid) {
      if (editform.value.id != undefined) {
        wp.updateItem(editform.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          editFormOpen.value = false;
          init();
        });
      } else {
        wp.addItem(editform.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          editFormOpen.value = false;
          init();
        });
      }
    }
  });
}
/** 多选框选中数据 */
function handleSelectionChange(selection) {
   console.log(selection)
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("/workplan/export", {
    ...queryParams.value,
  }, "全部工作计划明细.xlsx");
}
/**获取所有人员数据 */
function getUserList(){
   user.getUserList().then(res=>{
      userList.value = res
      console.log(res);
      
   })
}
init()
getUserList()

</script>
