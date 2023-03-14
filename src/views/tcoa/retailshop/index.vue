<template>
   <div class="app-container">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-if="showSearch">
         <el-form-item label="网点编号" prop="shopsn">
            <el-input
               v-model="queryParams.shopsn"
               placeholder="请输入网点编号"
               clearable
               @keyup.enter="handleQuery"
            />
         </el-form-item>
         <selectPlugin labeltext="专管员" :defaultvalue="selectPlugin_conf.zgyselect.defaultvalue" :options="selectPlugin_conf.zgyselect.options" v-model:value="queryParams.area_manager"></selectPlugin>
         <selectPlugin labeltext="终端号" :defaultvalue="selectPlugin_conf.zdno.defaultvalue" :options="selectPlugin_conf.zdno.options" v-model:value="queryParams.termNo"></selectPlugin>
         <selectPlugin labeltext="状态" :defaultvalue="selectPlugin_conf.status.defaultvalue" :options="selectPlugin_conf.status.options" v-model:value="queryParams.status"></selectPlugin>
         <selectPlugin labeltext="市县乡" :defaultvalue="selectPlugin_conf.city_town.defaultvalue" :options="selectPlugin_conf.city_town.options" v-model:value="queryParams.city_town"></selectPlugin>
         <selectPlugin labeltext="经营类别" :defaultvalue="selectPlugin_conf.busitype.defaultvalue" :options="selectPlugin_conf.busitype.options" v-model:value="queryParams.business_type"></selectPlugin>
         <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <!-- <el-button icon="Refresh" @click="resetQuery(queryRef)">重置</el-button> -->
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
         :data="shoplist.slice((pageNum - 1) * pageSize, pageNum * pageSize)"
         style="width: 100%;"
      >
         <el-table-column label="序号" width="50" type="index" align="center">
            <template #default="scope">
               <span>{{ (pageNum - 1) * pageSize + scope.$index + 1 }}</span>
            </template>
         </el-table-column>
         <el-table-column label="编号" align="center" prop="shopsn" />
         <el-table-column label="业主" align="center" prop="agent" />
         <el-table-column label="专管员" align="center" prop="area_manager" />
         <el-table-column label="地址" align="left" prop="shop_addr" :show-overflow-tooltip="true" width="260" />
         <el-table-column label="开店时间" align="center" prop="create_time">
            <template #default="scope">
               <span>{{ parseTime(scope.row.create_time,'{y}年{m}月{d}日') }}</span>
            </template>
         </el-table-column>
         <el-table-column label="终端编号" align="center" prop="termNo" />
         <el-table-column label="经营类别" align="center" prop="business_type" />
         <el-table-column label="竞彩" align="center" prop="sporlot_type" />
         <el-table-column label="积分" align="center" prop="shop_points" />
         <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">
            <template #default="scope">
                  <el-button @click="showDetail(scope.row)" size="small">详情</el-button>
                  <el-button @click="edit(scope.row)"  size="small">修改</el-button>
            </template>
         </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="pageNum" v-model:limit="pageSize" />

   </div>
</template>
<script setup>
import rs from "@/api/tcoa/retailshop";
import matouFunc from "@/utils/matouFunc"
import selectPlugin from "@/components/tcoa/search-select"
import { useRouter } from "vue-router";

let showSearch = ref(true)
const { proxy } = getCurrentInstance();
const shoplist = ref([]);
const total = ref(0);
const pageNum = ref(1);
const pageSize = ref(15);
const loading = ref(true);
const store = useStore()
const queryParams = ref({
   area_manager: matouFunc.renamebyCN(store.state.user.name),
   termNo:'101',
   status:'正常'
});
const selectPlugin_conf = {
   zgyselect:{
      options:[
         { label:'全部'}
      ],
      defaultvalue:matouFunc.renamebyCN(store.state.user.name)
   },
   busitype:{
      options:[
         {
            value:'体彩专营店'
         },
         {
            value:'彩票专营店'
         },
         {
            value:'彩票兼营店'
         },
         {
            value:'体彩兼营店'
         },
         {
            label:'全部'
         }
      ],
   },
   zdno:{
      options:[{value:'101'},{value:'801'},{value:'901'},{value:'701'},{label:'全部',}],
      defaultvalue:'101'
   },
   status:{
      options:[{value:'正常'},{value:'暂停'},{value:'已退'},{label:'全部',}],
      defaultvalue:'正常'
   },
   city_town:{
      options:[{value: '市'},{value: '县'},{value: '乡'},{label: '全部',}]
   }
}
const router = useRouter()

/** 查询列表 */
function getList() {
  loading.value = true;
  rs.getList(queryParams.value).then(response => {
   //  console.log(response)
    shoplist.value = response.data;
    total.value = response.total;
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  pageNum.value = 1;
  getList(queryParams.value);
}
/** 重置搜索按钮操作 */

/** 导出按钮操作 */
function handleExport() {
  proxy.download("/retailshop/export", {
    ...queryParams.value,
  }, "导出明细.xlsx");
}
/**修改网点信息 */
function edit(row){
   router.push({
      path:'/tcoa/retailshop/showdetail',
      query:{
         shopsn:row.shopsn,
         editDisable:true
      }
   })
}
/**查看网点信息 */
function showDetail(row){
   router.push({
      path:'/tcoa/retailshop/showdetail',
      query:{
         shopsn:row.shopsn,
      }
   })
}

getList();
</script>

