<template>
   <div class="app-container">
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
         <!-- <el-col :span="1.5">
            <el-button
               type="warning"
               plain
               icon="Download"
               @click="handleExport"
            >导出</el-button>
         </el-col> -->
         <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
      </el-row>
      <!-- 表格数据 -->
      <el-table
         v-loading="loading"
         style="width: 100%;"
         :data="itemList"
         @selection-change="handleSelectionChange"
      >
         <el-table-column type="selection" width="55" align="center" v-hasPermi="['system:role:remove']" />
         <!-- <el-table-column label="车辆名称" align="center" width="100" prop="carname" :show-overflow-tooltip="true" /> -->
         <el-table-column label="车牌号" align="center" prop="carnumber" :show-overflow-tooltip="true" />
         <el-table-column label="使用区域" align="center" prop="adminarea" width="150" :show-overflow-tooltip="true" />
         <el-table-column label="当前里程" align="center" prop="mileage" :show-overflow-tooltip="true" />
         <el-table-column label="当前油量" align="center" prop="oilmass" :show-overflow-tooltip="true" />
         <!-- <el-table-column label="上次保养" align="center" prop="maintain" :show-overflow-tooltip="true">
            <template #default="scope">
                  <span>{{ parseTime(scope.row.maintain,'{m}月{d}日') }}</span>
            </template>
          </el-table-column> -->
         <el-table-column label="下次保养" align="center" prop="nextMaintain" :show-overflow-tooltip="true">
            <template #default="scope">
                  <span>{{ parseTime(scope.row.nextMaintain,'{m}月{d}日') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="借出时间" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
                  <span>{{ parseTime(scope.row.borrowTime,'{m}月{d}日') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="归还时间" align="center" :show-overflow-tooltip="true">
            <template #default="scope">
                  <span v-if="scope.row.restoreTime>= scope.row.borrowTime">{{ parseTime(scope.row.restoreTime,'{m}月{d}日') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="安全" align="center" prop="safety" width="80" :show-overflow-tooltip="true" />
         <el-table-column label="状态" align="center" prop="state" width="100" :show-overflow-tooltip="true" />
         <el-table-column label="借用人" align="center" prop="borrower" :show-overflow-tooltip="true">
            <template #default="scope">
               <span>{{ matouFunc.renamebyCN(scope.row.borrower) }}</span>
            </template>
         </el-table-column>
         <el-table-column label="目的地" align="center" prop="destination" :show-overflow-tooltip="true" />
         <el-table-column label="查看" align="center" width="80">
            <template #default="scope">
               <el-button size="small" round @click="getIoList(scope.row)" >明细</el-button>
            </template>
         </el-table-column>
         <el-table-column label="操作" align="center" width="60">
            <template #default="scope">
               <el-button size="small" v-if="scope.row.state=='空闲' && scope.row.safety!='安全故障'"  type="success" @click="storeOut(scope.row)">借</el-button>
               <el-button size="small" v-if="scope.row.state=='已借出' && store.getters.name==scope.row.borrower" type="primary" @click="storeIn(scope.row)">还</el-button>
            </template>
         </el-table-column>
      </el-table>
      <!-- 车辆使用明细 -->
      <el-dialog title="车辆使用明细" v-model="ioListShow" width="90%" append-to-body>
         <el-table
            v-loading="loading"
            style="width: 100%;"
            :data="ioList"
            table-layout='auto'
         >
            <el-table-column label="序号" width="50" type="index" align="center">
               <template #default="scope">
                  <span>{{ scope.$index + 1 }}</span>
                  <!-- <span>{{ scope.row.carname }}</span> -->
               </template>
            </el-table-column>
            <el-table-column label="车辆" align="center" :show-overflow-tooltip="true">
               <template #default="scope">
                     <span>{{ scope.row.carname+"-"+scope.row.carnumber}}</span>
               </template>
            </el-table-column>
            <el-table-column label="时间" align="center" width="100" prop="appTime" :show-overflow-tooltip="true">
               <template #default="scope">
                     <span>{{ parseTime(scope.row.appTime,'{m}月{d}日') }}</span>
               </template>
            </el-table-column>
            <el-table-column label="里程" align="center" prop="mileage" :show-overflow-tooltip="true" />
            <el-table-column label="油量" align="center" prop="oilmass" :show-overflow-tooltip="true" />
            <el-table-column label="借还" align="center" prop="actionType" :show-overflow-tooltip="true"
               :filters="[
                  { text: '借车', value: '借车' },
                  { text: '还车', value: '还车' },
               ]"
               :filter-method="ioListFilterHandler"
            />
            <el-table-column label="借用人" align="center" prop="appUser" :show-overflow-tooltip="true">
               <template #default="scope">
                  <span>{{ matouFunc.renamebyCN(scope.row.appUser) }}</span>
               </template>
            </el-table-column>
            <el-table-column label="目的地" align="center" prop="destination" :show-overflow-tooltip="true" />
            <el-table-column label="用车备注" align="center" width="280" prop="appReason" :show-overflow-tooltip="true" />
         </el-table>
      </el-dialog>
      <!-- 借车对话框 -->
      <el-dialog :title="title" v-model="open" width="80%" append-to-body>
         <el-form ref="storeIORef" :model="storeIOForm" :rules="stroeIORules" label-width="80px">
            <el-form-item label="车辆名称" prop="carname">
                     <span>{{storeItemRow.carname}}</span>
            </el-form-item>
            <el-form-item label="车牌号" prop="carnumber">
                     <span>{{storeItemRow.carnumber}}</span>
            </el-form-item>
            <el-form-item label="当前里程" prop="mileage">
                <el-input v-model="storeIOForm.mileage" :placeholder="'目前里程:'+storeItemRow.mileage"/>
            </el-form-item>
            <el-form-item label="当前油量" prop="oilmass">
                <el-slider v-model="storeIOForm.oilmass" :step="10" show-stops show-input size="large"/>
            </el-form-item>
            <el-form-item label="目的地" prop="destination">
                <el-input v-model="storeIOForm.destination" placeholder="目的地"/>
            </el-form-item>
            <el-form-item label="用途备注" prop="appReason">
                <el-input v-model="storeIOForm.appReason" placeholder="出入库原因或说明，如个人借用等"/>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitApp">提 交</el-button>
               <el-button @click="cancelApp">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 还车对话框 -->
      <el-dialog :title="title" v-model="returnopen" width="80%" append-to-body>
         <el-form ref="storeReturnRef" :model="storeReturnForm" :rules="stroeReturnRules" label-width="80px">
            <el-form-item label="车辆名称" prop="carname">
                     <span>{{storeItemRow.carname}}</span>
            </el-form-item>
            <el-form-item label="车牌号" prop="carnumber">
                     <span>{{storeItemRow.carnumber}}</span>
            </el-form-item>
            <el-form-item label="是否清理" prop="clean">
               <el-radio-group v-model="storeReturnForm.clean">
                  <el-radio-button label="是">已清理</el-radio-button>
                  <el-radio-button label="否">未清理</el-radio-button>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="是否有安全隐患" prop="safety">
               <el-radio-group v-model="storeReturnForm.safety">
                  <el-radio-button label="良好">未发现安全隐患</el-radio-button>
                  <el-radio-button label="故障">存在安全隐患</el-radio-button>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="当前里程" prop="mileage">
                <el-input v-model="storeReturnForm.mileage" placeholder="目前里程:"/>
            </el-form-item>
            <el-form-item label="当前油量" prop="oilmass">
               <el-slider v-model="storeReturnForm.oilmass" :step="10" show-stops show-input />
            </el-form-item>
            <el-form-item label="目的地" prop="destination">
                <el-input v-model="storeReturnForm.destination" :placeholder="'目的地:'+storeItemRow.destination"/>
            </el-form-item>
            <el-form-item label="还车备注" prop="appReason">
                <el-input v-model="storeReturnForm.appReason" placeholder="备注说明"/>
            </el-form-item>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="returnApp">提 交</el-button>
               <el-button @click="cancelReturnApp">取 消</el-button>
            </div>
         </template>
      </el-dialog>
      <!-- 新增/更新 对话框 -->
      <el-dialog :title="title" v-model="editFormOpen" width="80%" append-to-body>
         <el-form ref="editFormRef" :model="editform" :rules="editFormRules" label-width="80px">
            <el-form-item label="车辆名称" prop="carname">
               <el-input v-model="editform.carname" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item label="车牌号" prop="carnumber">
                <el-input-number v-model="editform.carnumber" :placeholder="请输入车牌号"/>
            </el-form-item>
            <el-form-item label="使用区域" prop="adminarea">
                <el-input v-model="editform.adminarea" placeholder="请输入使用区域"/>
            </el-form-item>
            <el-form-item label="里程" prop="mileage">
                <el-input-number v-model="editform.mileage" placeholder="请输入里程"/>
            </el-form-item>
            <el-form-item label="油量" prop="oilmass">
                <el-input v-model="editform.oilmass" placeholder="请输入当前油量"/>
            </el-form-item>
            <el-form-item label="状态" prop="state">
               <el-radio-group v-model="editform.state">
                  <el-radio-button label="空闲">空闲</el-radio-button>
                  <el-radio-button label="借出">借出</el-radio-button>
               </el-radio-group>
            </el-form-item>
            <el-form-item label="上次保养" prop="maintain">
                <el-date-picker v-model="editform.maintain" type="datetime" placeholder="上次保养" />
            </el-form-item>
            <el-form-item label="下次保养" prop="nextMaintain">
                <el-date-picker v-model="editform.nextMaintain" type="datetime" placeholder="下次保养" />
            </el-form-item>
            <el-form-item label="借用人" prop="borrower">
                <el-input v-model="editform.borrower" placeholder="请输入借用人"/>
            </el-form-item>
            <el-form-item label="目的地" prop="destination">
                <el-input v-model="editform.destination" placeholder="请输入目的地"/>
            </el-form-item>
            <el-form-item label="车辆管理员" prop="keeper">
                <el-input v-model="editform.keeper" placeholder="请输入车辆管理员"/>
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
<script setup>
import car from "@/api/tcoa/office/carManagement";
import matouFunc from "@/utils/matouFunc"
const { proxy } = getCurrentInstance();
// const store = useStore();
// const getters = computed(() => store.getters).value;
// console.log("打印当前用户:"+store.getters.name)
const open = ref(false);
const ioListShow = ref(false);
const returnopen = ref(false);
const editFormOpen = ref(false);
const itemList = ref([]);
const ioList = ref([]);
const loading = ref(true);
const title = ref("");
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const editform = ref({})

const queryParams = ref({
  ipaddr: undefined,
  userName: undefined
});
//借车表单信息
const storeIOForm = ref({})
const stroeIORules = ref({
   destination: [{ required: true, message: '请输入目的地', trigger: 'blur' }],
   oilmass: [{ required: true, message: '请输入当前油量', trigger: 'blur' }],
   mileage: [{ required: true, message: '请输入当前里程', trigger: 'blur' }],
   // appReason: [{ required: true, message: '请输入申请原因', trigger: 'blur' }],
})
//还车表单信息
const storeReturnForm = ref({})
const stroeReturnRules = ref({
   clean: [{ required: true, message: '请选择卫生情况', trigger: 'blur' }],
   safety: [{ required: true, message: '请选择安全情况', trigger: 'blur' }],
   oilmass: [{ required: true, message: '请输入当前油量', trigger: 'blur' }],
   mileage: [{ required: true, message: '请输入当前里程', trigger: 'blur' }],
   // appReason: [{ required: true, message: '请输入申请原因', trigger: 'blur' }],
})

const storeItemRow = ref({})

/**编辑/新增 对话框验证 */
const editFormRules = ref({
   carname: [{ required: true, message: '请输入车辆名称', trigger: 'blur' }],
   carnumber: [{ required: true, message: '请输入车牌号', trigger: 'blur' }],
})
/** 查询仓库车辆列表 */
function getList() {
  loading.value = true;
  car.getItemList().then(response => {
    console.log(response)
    itemList.value = response.data;
    loading.value = false;
  });
}
//---------借车明细功能开始-----------
/** 查询车辆最近15次借用明细 */
function getIoList(row) {
   console.log(row.id)
  car.getIoList({carId:row.id}).then(response => {
    console.log(response)
    ioList.value = response.data;
    ioListShow.value = true;
  });
}
const ioListFilterHandler = ( value,row,column) => {
  const property = column['property']
  return row[property] === value
}
//----------借车明细功能结束-------------


/**
 * 打开借车窗口
 */
function storeOut(row){
   if(row.state!="空闲"){
      proxy.$message.error("当前车辆不可用，无法出库！")
   }else{
      storeItemRow.value = row
      open.value = true
      title.value = "车辆出库申请"
      storeIOForm.value.actionType = "借车"
      storeIOForm.value.oilmass = row.oilmass*1
      storeIOForm.value.mileage = row.mileage*1
   }
}
/**提交借车申请 */
async function submitApp(){
  proxy.$refs["storeIORef"].validate(valid=>{
     if(valid){
         let query = {}
         query.carname= storeItemRow.value.carname
         query.carId= storeItemRow.value.id
         query.carnumber= storeItemRow.value.carnumber
         query.actionUser= storeItemRow.value.keeper
         query.actionType= storeIOForm.value.actionType
         query.appReason= storeIOForm.value.appReason
         query.oilmass= storeIOForm.value.oilmass
         query.mileage= storeIOForm.value.mileage
         query.destination= storeIOForm.value.destination
         console.log(query)
         car.storeActApp(query).then(res=>{
            console.log(res)
            getList();
         })
         storeIOForm.value = {};
         proxy.resetForm("storeIORef");
         open.value = false;
     }
  })
}
/**
 * 打开还车窗口
 */
function storeIn(row){
   if(row.state=="空闲"){
      proxy.$message.error("当前车辆无须归还！")
   }else{
      storeItemRow.value = row
      returnopen.value = true
      title.value = "车辆入库申请"
      storeReturnForm.value.actionType = "还车"
      storeReturnForm.value.oilmass = row.oilmass*1
      console.log(storeReturnForm.value)
  }
}

/**提交还车申请 */
async function returnApp(){
  proxy.$refs["storeReturnRef"].validate(valid=>{
     if(valid){
         let query = {}
         //todo 将以下参数封装成formdata提交给formjs展示
         query.carname= storeItemRow.value.carname
         query.carId= storeItemRow.value.id
         query.carnumber= storeItemRow.value.carnumber
         query.actionUser= storeItemRow.value.keeper
         query.actionType= storeReturnForm.value.actionType
         query.appReason= storeReturnForm.value.appReason
         query.oilmass= storeReturnForm.value.oilmass
         query.mileage= storeReturnForm.value.mileage
         query.clean= storeReturnForm.value.clean
         query.safety= storeReturnForm.value.safety
         query.destination= storeReturnForm.value.destination
         console.log(query)
         car.storeActApp(query).then(res=>{
            console.log(res)
            returnopen.value = false;
            storeReturnForm.value = {};
            proxy.resetForm("storeReturnRef");
            getList();
         })
     }
  })
}
/** 取消借车按钮 */
function cancelApp() {
  open.value = false;
  storeIOForm.value = {};
  proxy.resetForm("storeIORef");
}
/** 取消还车按钮 */
function cancelReturnApp() {
  returnopen.value = false;
  storeReturnForm.value = {};
  proxy.resetForm("storeReturnRef");
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

/** 添加车辆 */
function handleAdd() {
  editFormOpen.value = true;
  title.value = "添加车辆类目";
}

/** 打开编辑对话框 */
function handleUpdate() {
  const itemId = ids.value;
  car.getItemDetail({id:itemId[0]}).then(response => {
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
         console.log();
         
        car.updateItem(editform.value).then(response => {
          proxy.$modal.msgSuccess("修改成功");
          editFormOpen.value = false;
          getList();
        });
      } else {
        car.addItem(editform.value).then(response => {
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


/** 重置搜索按钮操作 */
function resetQuery() {
  proxy.resetForm("storeIORef");
  handleQuery();
}
/** 导出按钮操作 */
function handleExport() {
  proxy.download("/mostore/export", {
    ...queryParams.value,
  }, "仓库车辆明细.xlsx");
}
getList();
</script>
