<template>
  <div ref="ganttRef"></div>
</template>
    
<script>
import { onMounted, ref } from 'vue'
import { gantt } from 'dhtmlx-gantt' // 引入dhtmlx-gantt
export default {
  name: 'Gantt',
  props: {
  	// 任务对象
    tasks: {
      type: Object,
      default: () => {
        return {
          data: [], // 数据数组
          links: [] // 连接关系
        }
      }
    },
    // 显示列设置
    columns: {
      type: Array,
      default: () => {
        return [
					{ name: 'text', label: '任务', tree: true, width: '240' },
					{ name: 'end_date', label: '截止日期', tree: true, width: '130' },
				]
      }
    },
    // 显示单位
    scaleUnit: {
      type: String,
      default: 'week' // “minute”, “hour”, “day”, “week”, “quarter”, “month”, “year”
    },
    // 时间显示格式 
    dateScale: {
      type: String,
      default: '%m月%d日'
    }
  },
  setup(props) {
		// 挂载ref
		const ganttRef = ref()
    // 监听父组件传递子组件数据变化
    watch(()=>props.tasks.data, (newVal, oldValue) => {
        gantt.clearAll();
        gantt.parse(props.tasks);
				var today = new Date();
				gantt.addMarker({
					start_date: today,
					css: "today",
					text: "今日",
				});
    });
    watch(()=>props.scaleUnit, (newVal, oldValue) => {
        gantt.config.scale_unit =newVal
				if(newVal=="day"){
					// 在时间线上增加一行显示星期
					gantt.config.subscales = [
					  {unit:"day",  step:1, date:"星期"+"%D" },  
					]
				}else{
					gantt.config.subscales = []
				}
        gantt.render();
    });
    onMounted(() => {
      // 清空之前的配置
      gantt.clearAll()
			gantt.plugins({
				marker: true,
				tooltip: true// 启用 tooltip 插件
			});


			if(props.scaleUnit =="day"){
				// 在时间线上增加一行显示星期
				gantt.config.subscales = [
					{unit:"day",  step:1, date:"星期"+"%D" },  
				]
			}
      // 默认配置
      gantt.config.xml_date = '%Y-%m-%d'
      gantt.i18n.setLocale('cn') // 设置中文
			// 水平或垂直滚动条尺寸
			gantt.config.scroll_size = 20;
    	gantt.config.readonly = true // 设置为只读
			//是否显示左侧树表格
      gantt.config.show_grid = true

			// 当task的长度改变时，自动调整图标坐标轴区间用于适配task的长度
			gantt.config.fit_tasks = true;
      gantt.config.columns = props.columns
      gantt.config.scale_unit = props.scaleUnit   
      gantt.config.date_scale = props.dateScale
			//任务栏周末亮色
      // gantt.templates.timeline_cell_class = function(item,date){
      //   if(date.getDay()== 0 || date.getDay()== 6){
      //     return "weekend";
      //   }
      // };
			//计算剩余时间
			gantt.templates.task_class = function(start, end, task){
				console.log(task.text)
				var endtime=end.getTime()
				var now = new Date().getTime()
				if(now > endtime){
					return "xx";
				}
			};
			// 把任务或者连线拖拽到浏览器屏幕外时，自动触发滚动效果，相当于拖动滚动条
			gantt.config.autoscroll = true;
      // 表格列宽自适应
      gantt.config.autofit = true;
      // 初始化甘特图
      gantt.init(ganttRef.value)
      // 渲染数据
      gantt.parse(props.tasks)
    })
    return {
      ganttRef
    }
  }
}

</script>
<style>
@import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
.weekend{
	background: rgb(250, 192, 2);
	opacity: 0.1;
}
.today {
	background-color: rgb(233, 83, 24);
}
.xx{
	background: rgb(245, 3, 3);
	border: red;
}
</style>