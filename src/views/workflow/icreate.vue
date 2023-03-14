<template>
  <div class="app-container home">
    <el-card class="update-log">
      <template v-slot:header>
        <div class="clearfix">
          <span>我发起的流程</span>
        </div>
      </template>
      <div class="body">
        <el-table :data="ownFlow" border style="width: 100%">
          <el-table-column prop="description" label="工作描述" width="450" />
          <el-table-column prop="procDefName" label="类别" />
          <el-table-column prop="currentTaskName" label="当前步骤" />
          <el-table-column prop="assginee" label="当前处理" >
            <template #default="scope">
                <span>{{ matouFunc.renamebyCN(scope.row.assginee) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="startTime" sortable  label="发起时间">
            <template #default="scope">
                  <span>{{ parseTime(scope.row.startTime,'{m}月{d}日 {h}:{i}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button @click="getHighLightNodes(scope.row)" >详情</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button @click="urgeBySMS(scope.row)" v-if="scope.row.state=='ACTIVE'">短信催办</el-button>
            </template>
          </el-table-column>          
          <!-- <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button @click="delIns(scope.row)" v-if="scope.row.state=='处理中'">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-pagination 
          small background
          v-show="total > 0"
          :total="total" 
          layout="total, prev, pager, next,sizes"
          v-model:currentPage="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          @current-change="getInsCreatedByMe"
          @size-change="getInsCreatedByMe"
          class="mt-4" />
      </div>
    </el-card>
  </div>
</template>
<script setup name="ownFlow">
// import tools from "@/api/workflow/tools";
import ins from "@/api/camunda/ins";
import { useRouter } from 'vue-router';
import matouFunc from "@/utils/matouFunc"
// import { onBeforeUnmount, onUnmounted } from "vue-demi";

const queryParams = reactive({
  pageNum: 1,
  pageSize: 30,
})
const total = ref(0)
const router = useRouter();
const ownFlow = ref([])
// const store = useStore();
// const getters = computed(() => store.getters).value;
const { proxy } = getCurrentInstance()

function getInsCreatedByMe(){
  ins.getInsCreatedByMe({pageNum:queryParams.pageNum,pageSize:queryParams.pageSize}).then((res)=>{
    console.log(res)
    ownFlow.value = res.data
    total.value = res.total
  })
}
function urgeBySMS(row){
  ins.urgeBySMS({insId:row.insID,procDefName:row.procDefName}).then(res=>{
    if(res.length>0){
      proxy.$message.success("提醒短信已发送")
    }
    console.log(res)
  })
}
/**
 * 获取高亮历史详情
 */
function getHighLightNodes(row){
  router.push({ path: '/bpmn/historyView', query: { insId: row.insID,procDefId:row.procDefID }})
}
/**
 * 删除我发起的实例，只有第一步的可以删除，有步骤完成的无法删除，需要先退回第一步才能删除
 */
// function delIns(row){
//   tools.delInsByInsId({insId:row.insId}).then(res=>{
//     getInsCreatedByMe()
//     proxy.$message.success("删除成功")
//   })
// }
// onUnmounted(()=>{
//     alert("unmounted")
// })
// onBeforeUnmount(()=>{

//   alert("before")
// })
getInsCreatedByMe()
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

