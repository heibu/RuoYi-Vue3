<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          流程实例清单
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
              <span>流程管理</span>
            </div>
          </template>
          <div class="body">
            <el-table :data="insList" border style="width: 100%">
              <el-table-column prop="createUser" label="发起人" width="80">
                <template #default="scope">
                    <span>{{ matouFunc.renamebyCN(scope.row.createUser) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="procDefName" label="模型类别" />
              <!-- <el-table-column prop="defVersion" label="版本号"/> -->
              <el-table-column prop="currentTaskName" label="当前任务"/>
              <el-table-column prop="description" label="任务描述" width="320"/>
              <el-table-column prop="assginee" label="处理人" width="80">
                <template #default="scope">
                    <span>{{ matouFunc.renamebyCN(scope.row.assginee) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="startTime" sortable  label="发起时间">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.startTime,'{m}月{d}日 {h}:{i}') }}</span>
                    </template>
              </el-table-column>
              <el-table-column prop="endTime" sortable  label="结束时间">
                    <template #default="scope">
                        <span>{{ parseTime(scope.row.endTime,'{m}月{d}日 {h}:{i}') }}</span>
                    </template>
              </el-table-column>
              <el-table-column prop="state" label="状态" />
              <!-- <el-table-column prop="procDefKey" label="实例KEY" /> -->
              <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-button @click="getHighLightNodes(scope.row)" >详情</el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
                <template #default="scope">
                  <el-button @click="urgeBySMS(scope.row)" v-if="scope.row.state=='ACTIVE'">短信催办</el-button>
                </template>
              </el-table-column>          
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                  <!-- 弹出删除instance确认框 -->
                  <el-popconfirm
                    confirm-button-text="删除"
                    cancel-button-text="取消"
                    :icon="InfoFilled"
                    icon-color="red"
                    title="确认删除?"
                    @confirm="delIns(scope.row)"
                  >
                    <template #reference>
                      <el-button>删除</el-button>
                    </template>
                  </el-popconfirm>
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
      
  </div>
</template>

<script setup name="Index">
import tools from "@/api/workflow/tools";
import ins from "@/api/camunda/ins";
import { useRouter } from 'vue-router';
import matouFunc from "@/utils/matouFunc"
import { reactive, ref } from "vue-demi";

const queryParams = reactive({
  pageNum: 1,
  pageSize: 30,
})
const total = ref(0)
const insID = ref("")
const insList = ref([])
// const store = useStore();
// const getters = computed(() => store.getters).value;
const { proxy } = getCurrentInstance()
const router = useRouter();

/**
 * 获取所有我的待办任务
 */
function getinfo(){
  // userinfo.username=getters.name
  console.log(matouFunc.renamebyCN("shijincai"))
  tools.getPorcInsList({pageNum:queryParams.pageNum,pageSize:queryParams.pageSize}).then((res)=>{
    console.log(res)
    insList.value = res.data
    total.value = res.total
  })
}


/**
 * 获取高亮历史详情
 */
function getHighLightNodes(row){
  console.log(row)
  router.push({ path: '/bpmn/historyView', query: { insId: row.insID,procDefId:row.procDefID }})
}

/**删除instance */
function delIns(row){
  ins.delInsByID({insID:row.insID}).then(res=>{
    proxy.$message.success("删除成功")
    getinfo()
  })
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

