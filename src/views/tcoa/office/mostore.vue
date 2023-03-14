<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
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
      </el-row>
      <!-- 表格数据 -->
      <div style="margin-top: 10px">
        <el-radio-group v-model="queryParams.workTeam" @change="getTaskGanteByUsername">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="概率组">概率组</el-radio-button>
            <el-radio-button label="竞猜组">竞猜组</el-radio-button>
            <el-radio-button label="即开组">即开组</el-radio-button>
            <el-radio-button label="公关组">公关组</el-radio-button>
            <el-radio-button label="渠道组">渠道组</el-radio-button>
            <el-radio-button label="督导组">督导组</el-radio-button>
            <el-radio-button label="责任彩票组">责任彩票组</el-radio-button>
        </el-radio-group>
    </div>
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
         <el-table-column label="物品名称" align="center" width="220" prop="itemName" :show-overflow-tooltip="true" />
         <el-table-column label="物品类别" align="center" prop="itemCate" :show-overflow-tooltip="true" />
         <el-table-column label="品牌" align="center" prop="itemBrand" :show-overflow-tooltip="true" />
         <el-table-column label="单位" align="center" prop="specification" :show-overflow-tooltip="true" />
         <el-table-column label="单价" align="center" prop="price" :show-overflow-tooltip="true" />
         <el-table-column label="保管人" align="center" prop="storekeeper" :show-overflow-tooltip="true">
            <template #default="scope">
               <span>{{ matouFunc.renamebyCN(scope.row.storekeeper) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="数量" align="center" prop="count" :show-overflow-tooltip="true" />
         <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true" />
         <el-table-column label="出库" align="center" width="180">
            <template #default="scope">
               <el-button @click="storeOut(scope.row)">出库/借用</el-button>
            </template>
         </el-table-column>
         <el-table-column label="入库" align="center" width="180">
            <template #default="scope">
               <el-button @click="storeIn(scope.row)">入库/归还</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

      <!-- 出入库对话框 -->
      <el-dialog :title="title" v-model="open" width="80%" append-to-body>
         <el-form ref="storeIORef" :model="storeIOForm" :rules="stroeIORules" label-width="80px">
            <el-form-item label="物品名称" prop="itemName">
                     <span>{{storeItemRow.itemName}}</span>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input v-model="storeIOForm.count" :placeholder="'请输入数量,目前剩余:'+storeItemRow.count"/>
            </el-form-item>
            <el-form-item label="原因" prop="appReason">
                <el-input v-model="storeIOForm.appReason" placeholder="出入库原因或说明，如个人借用等"/>
            </el-form-item>
            <el-form-item label="网点编号" prop="termID">
                <el-input v-model="storeIOForm.termID" placeholder="请输入实体店编号"/>
            </el-form-item>
            <el-form-item label="序列号" prop="sn">
                <el-input v-model="storeIOForm.sn" placeholder="请输入物品序列号"/>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitApp">提 交</el-button>
               <el-button @click="cancelApp">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 新增/更新 对话框 -->
      <el-dialog :title="title" v-model="editFormOpen" width="80%" append-to-body>
         <el-form ref="editFormRef" :model="editform" :rules="editFormRules" label-width="80px">
            <el-form-item label="物品名称" prop="itemName" width="220">
               <el-input v-model="editform.itemName" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item label="数量" prop="count">
                <el-input-number v-model="editform.count" :placeholder="请输入数量"/>
            </el-form-item>
            <el-form-item label="品牌" prop="itemBrand">
                <el-input v-model="editform.itemBrand" placeholder="请输入品牌"/>
            </el-form-item>
            <el-form-item label="分类" prop="itemCate">
                <el-input v-model="editform.itemCate" placeholder="请输入类别"/>
            </el-form-item>
            <el-form-item label="计量单位" prop="specification">
                <el-input v-model="editform.specification" placeholder="请输入单位"/>
            </el-form-item>
            <el-form-item label="管理员" prop="storekeeper">
                <el-input v-model="editform.storekeeper" placeholder="请输入物品管理员"/>
            </el-form-item>
            <el-form-item label="单价" prop="price">
                <el-input-number v-model="editform.price" :precision="2" placeholder="请输入单价"/>
            </el-form-item>
            <el-form-item label="资产编号" prop="assetsNO">
                <el-input v-model="editform.assetsNO" placeholder="请输入资产编号"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-input v-model="editform.status" placeholder="请输入物品状态"/>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitEdit">提 交</el-button>
               <el-button @click="cancelEdit">取 消</el-button>
            </div>
         </template>
      </el-dialog>
   </div>
</template>
<script setup name="Online">
import sm from "@/api/tcoa/office/storeManagement";
import matouFunc from "@/utils/matouFunc"
const { proxy } = getCurrentInstance();
const open = ref(false);
const editFormOpen = ref(false);
const itemList = ref([]);
const loading = ref(true);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(50);
const title = ref("");
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const editform = ref({})

const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
});
const storeIOForm = ref({})
const stroeIORules = ref({
   count: [{ required: true, message: '请输入出入库数量', trigger: 'blur' }],
   appReason: [{ required: true, message: '请输入申请原因', trigger: 'blur' }],
})
const storeItemRow = ref({})

/**编辑/新增 对话框验证 */
const editFormRules = ref({
   count: [{ required: true, message: '请输入数量', trigger: 'blur' }],
   itemName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
   itemCate: [{ required: true, message: '请输入类别', trigger: 'blur' }],
   specification: [{ required: true, message: '请输入计量单位', trigger: 'blur' }],
   storekeeper: [{ required: true, message: '请输入物品管理员英文名', trigger: 'blur' }],
})
/** 查询仓库物品列表 */
function getList() {
  loading.value = true;
  sm.getItemList(queryParams.value).then(response => {
    console.log(response)
    itemList.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}
/**
 * 出库操作
 */
function storeOut(row){
   if(row.count<1){
      proxy.$message.error("数量不足，无法出库！")
   }else if(row.status!="可用"){
      proxy.$message.error("当前物品不可用，无法出库！")
   }else{
      storeItemRow.value = row
      open.value = true
      title.value = "物品出库申请"
      storeIOForm.value.actionType = "出库"
      console.log(storeIOForm.value)
   }
}
/**
 * 入库操作
 */
function storeIn(row){
  storeItemRow.value = row
  open.value = true
  title.value = "物品入库申请"
  storeIOForm.value.actionType = "入库"
  console.log(storeIOForm.value)
}
/**提交出库/入库申请 */
function submitApp(){
  proxy.$refs["storeIORef"].validate(valid=>{
     if(valid){
         let query = {}
         query.itemID= storeItemRow.value.id
         query.itemName= storeItemRow.value.itemName
         query.actionUser= storeItemRow.value.storekeeper
         query.actionType= storeIOForm.value.actionType
         query.appReason= storeIOForm.value.appReason
         query.count= storeIOForm.value.count
         console.log(query)
         sm.storeActApp(query).then(res=>{
            console.log(res)
            open.value = false;
            storeIOForm.value = {};
            proxy.resetForm("storeIORef");
            getList();
         })
     }
  })
}
/** 取消出库按钮 */
function cancelApp() {
  open.value = false;
  storeIOForm.value = {};
  proxy.resetForm("storeIORef");
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
   console.log(selection)
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}
/** 删除按钮操作 */
function handleDelete() {
  const itemIds = ids.value;
  proxy.$modal.confirm('是否确认删除编号为"' + itemIds + '"的数据项?').then(function () {
    return delRole(itemIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => {});
}

/** 添加物品 */
function handleAdd() {
  editFormOpen.value = true;
  title.value = "添加物品类目";
}

/** 打开编辑对话框 */
function handleUpdate() {
  const itemId = ids.value;
  sm.getItemDetail({id:itemId[0]}).then(response => {
     title.value = "修改资料";  
    editform.value = response;
    editFormOpen.value = true;
  });
}
/** 提交新增/编辑 */
function submitEdit() {
  proxy.$refs["editFormRef"].validate(valid => {
    if (valid) {
      if (editform.value.id != undefined) {
        sm.updateItem(editform.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          editFormOpen.value = false;
          getList();
        });
      } else {
        sm.addItem(editform.value).then(response => {
          proxy.$modal.msgSuccess("新增成功");
          editFormOpen.value = false;
          getList();
        });
      }
    }
  });
}
/** 取消编辑按钮 */
function cancelEdit() {
  editFormOpen.value = false;
  editform.value = {};
  proxy.resetForm("editFormRef");
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
  proxy.download("/mostore/export", {
    ...queryParams.value,
  }, "仓库物品明细.xlsx");
}
getList();
</script>
