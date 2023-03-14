<template>
<div class="container">
    <div style="margin-top: 10px">
        <el-radio-group v-model="scaleUnit">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
    </div>
    <div style="margin-top: 10px">
        <el-radio-group v-model="workteam" @change="getPlanGanteByWorkteam">
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
    <gantt class="left-container" :scaleUnit="scaleUnit" :tasks="plans" v-loading="loading"></gantt>
</div>
</template>
 
<script setup>
import Gantt from '@/components/gante/index.vue';
import gt from "@/api/tcoa/office/gante"
// import { onMounted, reactive } from 'vue-demi';
// const store = useStore();
// const getters = computed(() => store.getters).value;
const loading = ref(true);
const plans = ref({
    data: [],
    links: [
        {id: 1, source: 1, target: 2, type: '0'}
    ]
})
const scaleUnit = ref("month")
const workteam = ref("即开组")
const queryParams = ref({
    workteam:"即开组",
    pageNum:1,
    pageSize:100
})
/**获取工作列表 */
getPlanGanteByWorkteam()

function getAllPlanGante(){
    gt.getAllPlanGante().then(res=>{
        plans.value.data=res
         console.log(plans.value.data)
         loading.value = false;
    })
}
function getPlanGanteByWorkteam(){
    loading.value = true;
    if(workteam.value=="all"){
        getAllPlanGante()
    }else{
        gt.getPlanGanteByWorkteam({workteam:workteam.value}).then(res=>{
            plans.value.data=res
            console.log(plans.value.data)
            loading.value = false;
        })
    }
}

</script>
 
<style>
  .container {
    height: 88vh;
    width: 100%;
  }
  .left-container {
    overflow: hidden;
    position: relative;
    height: 88%;
  }
</style>