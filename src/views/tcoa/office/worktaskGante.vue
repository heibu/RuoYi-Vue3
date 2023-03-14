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
        <el-radio-group v-model="username" @change="getTaskGanteByUsername">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="shijincai">时金才</el-radio-button>
            <el-radio-button label="cuiguoliang">崔国亮</el-radio-button>
            <el-radio-button label="lichaofeng">李超锋</el-radio-button>
            <el-radio-button label="weichunjie">魏春杰</el-radio-button>
            <el-radio-button label="chenwu">陈伍</el-radio-button>
            <el-radio-button label="cuiwei">崔威</el-radio-button>
            <el-radio-button label="dongxin">董鑫</el-radio-button>
            <el-radio-button label="zhangmingliang">张明亮</el-radio-button>
            <el-radio-button label="sutianzhen">苏天真</el-radio-button>
            <el-radio-button label="xuxiangfu">徐祥府</el-radio-button>
            <el-radio-button label="yinwanjie">殷琬洁</el-radio-button>
            <el-radio-button label="xiaxindong">夏欣冬</el-radio-button>
            <el-radio-button label="liubo">刘波</el-radio-button>
            <el-radio-button label="wangqinbo">王勤博</el-radio-button>
            <el-radio-button label="shasha">沙莎</el-radio-button>
            <el-radio-button label="liujunwei">刘军伟</el-radio-button>
        </el-radio-group>
    </div>
    <gantt class="left-container" :scaleUnit="scaleUnit" :tasks="tasks" v-loading="loading"></gantt>
</div>
</template>
 
<script setup>
import Gantt from '@/components/gante/index.vue';
import gt from "@/api/tcoa/office/gante"
// import { onMounted, reactive } from 'vue-demi';
// const store = useStore();
// const getters = computed(() => store.getters).value;
const loading = ref(true);
const tasks = ref({
    data: [],
    links: [
        {id: 1, source: 1, target: 2, type: '0'}
    ]
})
const scaleUnit = ref("week")
const username = ref("shijincai")
const queryParams = ref({
    username:"shijincai",
    pageNum:1,
    pageSize:100
})
init()
/**获取工作列表 */
function init(){
    getTaskGanteByUsername()
}
function gettask(){
    gt.getAllTaskGante().then(res=>{
        tasks.value.data=res
         console.log(tasks.value.data)
         loading.value = false;
    })
}
function getTaskGanteByUsername(){
    loading.value = true;
    if(username.value=="all"){
        gettask()
    }else{
        gt.getTaskGanteByUsername({username:username.value}).then(res=>{
            tasks.value.data=res
            console.log(tasks.value.data)
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