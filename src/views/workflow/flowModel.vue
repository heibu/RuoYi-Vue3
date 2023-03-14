<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24">
        <el-card class="update-log">
          <template v-slot:header>
            <div class="clearfix">
              <span>流程模板</span>
            </div>
          </template>
          <div class="demo-fit">
            <div class="block" @click="handleStartFlow('regular-job-application')" v-hasRole="['sectionHead']">
              <span class="title">固定工作</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://tse1-mm.cn.bing.net/th/id/R-C.9f0d19b7d8279eb375758ab13537e73d?rik=TQWBmLCZk%2f8gMg&riu=http%3a%2f%2fpic.616pic.com%2fys_bnew_img%2f00%2f35%2f95%2fLjC458oXnB.jpg&ehk=AdWI9ljNkJUKoc6t0NRQto8smywzy6cQ9CklAjmMzSI%3d&risl=&pid=ImgRaw&r=0" />
            </div>
            <div class="block" @click="handleStartFlow('hntc-tempwork-application')" v-hasRole="['cashier']">
              <span class="title">省中心临时</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://i.52112.com/icon/256/20181002/22401/1071117.png" />
            </div>
            <div class="block" @click="handleStartFlow('sqtc-tempwork-application')" v-hasRole="['cashier']">
              <span class="title">分中心临时</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://i.52112.com/icon/256/20181002/22401/1071117.png" />
            </div>
            <div class="block" @click="handleStartFlow('sqtc-businesswork-apply')">
              <span class="title">月度业务类</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://img.zcool.cn/community/01aee45544021f0000019ae98f0cd6.jpg@1280w_1l_2o_100sh.jpg" />
            </div>
            <div class="block" @click="handleStartFlow('sqtc-managework-apply')">
              <span class="title">月度管理类</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://img.zcool.cn/community/01aee45544021f0000019ae98f0cd6.jpg@1280w_1l_2o_100sh.jpg" />
            </div>
            <div class="block" @click="handleStartFlow('sqtc-gamework-apply')">
              <span class="title">季度游戏类</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://img.zcool.cn/community/01aee45544021f0000019ae98f0cd6.jpg@1280w_1l_2o_100sh.jpg" />
            </div>
          </div>
          <hr>
          <div class="demo-fit">
            <div class="block" @click="handleStartFlow('sqtc-assessment-interfacciami')" v-hasRole="['cashier']">
              <span class="title">录入-制度项</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://bpic.588ku.com/element_origin_min_pic/19/08/09/068fb2ed76b22f17c489898eb55d42f8.jpg" />
            </div>
            <div class="block" @click="handleStartFlow('sqtc-assessment-bam')" v-hasRole="['cashier']">
              <span class="title">录入-其他项</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://img.ixintu.com/download/jpg/20201026/f46b422beb42cd10b40747dd28cc307b_512_511.jpg!bg" />
            </div>
          </div>
          <hr>
          <div class="demo-fit">
            <div class="block" @click="handleStartFlow('term-vio-notice')">
              <span class="title">实体店通知</span>
              <el-avatar shape="square" :size="100" fit="fill" src="https://tse1-mm.cn.bing.net/th/id/R-C.e7286cfded980badf57aeb915a9540ca?rik=PLzEjEh26IR44A&riu=http%3a%2f%2fpic.616pic.com%2fys_img%2f00%2f20%2f14%2fefGVLiYX8U.jpg&ehk=XBJOdwfGASkkSqcTV2w8vvlWuZi%2bEOJIeL%2fNhTor0ak%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1" />
            </div>
          </div>
          <hr>
          <div class="body" v-hasPermi="['system:role:remove']">
            <el-table :data="taskList" border style="width: 100%">
              <el-table-column type="index" width="50" label="序号"/>
              <el-table-column prop="name" label="模板名称" />
              <el-table-column prop="category" label="模板分类" />
              <el-table-column prop="version" label="版本号" />
              <el-table-column label="修改模板" align="center" v-hasPermi="['workflow:model:edit']" width="150" class-name="small-padding fixed-width">
                  <template #default="scope">
                        <el-button @click="handleUpdate(scope.row.defId)">编辑流程</el-button>
                  </template>
               </el-table-column>
               <el-table-column label="删除模板" align="center" width="150" v-hasPermi="['workflow:model:delete']" class-name="small-padding fixed-width">
                  <template #default="scope">
                        <el-button @click="handleDelete(scope.row.defId)">删除</el-button>
                  </template>
               </el-table-column>
              <el-table-column label="使用模板" align="center" width="150"  v-hasPermi="['workflow:model:start']" class-name="small-padding fixed-width">
                  <template #default="scope">
                        <el-button @click="handleStartFlow(scope.row.defKey)" >发起流程</el-button>
                  </template>
               </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="workflowModel">
import tools from "@/api/workflow/tools";
import { useRouter } from 'vue-router';

// const defKey = ref();
const router = useRouter();
const taskList = ref([])
const { proxy } = getCurrentInstance()
const Elmessage = proxy.$message

/**
获取所有流程定义模型
 */
function getModels(){
  tools.getModels().then(res=>{
    taskList.value = res
    console.log(res)
    Elmessage.success("加载完成")
  })
}

/**
打开流程表单 填表并发起流程
 */
function handleStartFlow(defKey){
  router.push({ path: '/bpmn/formjs', query: { defKey: defKey }})
}

/**
编辑流程
 */
function handleUpdate(defId) {
      router.push({
        path:"/bpmn/bpmnjs",
        query:{
          procDefId:defId
        }
      });
}

/**
删除 流程定义 procDef
 */
function handleDelete(defId) {
      let params = { defId:defId}
      tools.deleteDefByID(params).then(res=>{
        getModels();
        console.log($message)
          proxy.$message.success("删除成功")
          console.log(res)
        });
}
getModels()
</script>

<style scoped lang="scss">
.demo-fit {
  width: 960px;
  display: flex;
  text-align: center;
  // justify-content: space-between;
}
.demo-fit .block {
  margin-left: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
}

.demo-fit .title {
  margin-bottom: 10px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
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

