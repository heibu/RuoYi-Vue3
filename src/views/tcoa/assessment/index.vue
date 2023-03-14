<template>
   <div class="app-container">
      <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
         <el-tab-pane label="总体任务完成情况" name="first">
         </el-tab-pane>
         <el-tab-pane label="个人任务完成情况" name="second">
         </el-tab-pane>
      </el-tabs> -->
            <div ref="echartTotal" class="ech"/>
            <div ref="echartStaff" class="ech"/>
      
   </div>
</template>
<script setup name="assessIndex">
import * as echarts from 'echarts';
import as from "@/api/tcoa/assessment"
const { proxy } = getCurrentInstance();
const activeName = ref('first')
const echartTotal = ref(null);
const echartStaff = ref(null);
init()
function init(){
   as.getAllTaskStatic().then(res=>{
      console.log(res)
      const echartInst = echarts.init(echartTotal.value)
         const option = {
            series: [
               {
                  type: 'gauge',
                  startAngle: 180,
                  endAngle: 0,
                  min: 0,
                  max: res.total,
                  splitNumber: 10,
                  itemStyle: {
                  color: '#58D9F9',
                  shadowColor: 'rgba(0,138,255,0.45)',
                  shadowBlur: 10,
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                  },
                  progress: {
                  show: true,
                  roundCap: true,
                  width: 18
                  },
                  pointer: {
                  icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                  length: '75%',
                  width: 16,
                  offsetCenter: [0, '5%']
                  },
                  axisLine: {
                  roundCap: true,
                  lineStyle: {
                     width: 18
                  }
                  },
                  axisTick: {
                  splitNumber: 2,
                  lineStyle: {
                     width: 2,
                     color: '#999'
                  }
                  },
                  splitLine: {
                  length: 12,
                  lineStyle: {
                     width: 3,
                     color: '#999'
                  }
                  },
                  axisLabel: {
                  distance: 30,
                  color: '#999',
                  fontSize: 10
                  },
                  title: {
                  show: false
                  },
                  detail: {
                  backgroundColor: '#fff',
                  borderColor: '#999',
                  borderWidth: 2,
                  width: '60%',
                  lineHeight: 40,
                  height: 40,
                  borderRadius: 8,
                  offsetCenter: [0, '35%'],
                  valueAnimation: true,
                  formatter: function (value) {
                     return '{value|' + value.toFixed(0) + '}{unit|已完成}';
                  },
                  rich: {
                     value: {
                        fontSize: 30,
                        fontWeight: 'bolder',
                        color: '#777'
                     },
                     unit: {
                        fontSize: 15,
                        color: '#999',
                        padding: [0, 0, -20, 10]
                     }
                  }
                  },
                  data: [
                  {
                     value: res.complete
                  }
                  ]
               }
            ]
         };
         echartInst.setOption(option);
   })
   as.getStaffCompleteStatic().then(res=>{
      console.log(res)
      const echartInst = echarts.init(echartStaff.value)
      const option = {
         tooltip: {},
         legend: {
                data:['已完成数量','总任务数量']
            },
         xAxis: {
            data: res[0]
         },
         yAxis: {},
         series: [
            {
               name:"已完成数量",
               data: res[2],
               type: 'bar',
               stack: 'x'
            },
            {
               name:"总任务数量",
               data: res[1],
               type: 'bar',
               stack: 'y'
            }
         ]
      }
      echartInst.setOption(option);
   })
}

</script>
<style scoped>
.ech{
   height: 400px;
   width: 60%;
}
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 400;
}
</style>