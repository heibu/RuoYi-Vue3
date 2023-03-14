<template>
<div id="app">
<!-- //**
  bug
  bug
  必选包裹一个外部<div></div>
  否则，出现空白页面问题，关闭当前页面后，无法渲染其他页面
  且外div的外部不能有任何内容，包括注释
 */ -->
 <div class="containers">
   <div class="canvas" ref="canvas" id="canvas"></div>
  </div>
</div>
<div id="comments">
    <el-table v-loading="loading" :data="comments" >
      <el-table-column label="审批环节" align="center" prop="taskName" />
      <el-table-column label="审批人" align="center" prop="assignee">
        <template #default="scope">
              <span>{{ getcnname(scope.row.assignee) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批意见" align="center" prop="comment" />
      <el-table-column label="到达时间" align="center" prop="startTime">
        <template #default="scope">
              <span>{{ parseTime(scope.row.startTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批时间" align="center" prop="endTime">
        <template #default="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批用时" align="center" prop="duration">
        <template #default="scope">
            <span>{{ timeStampToDhms(scope.row.duration) }}</span>
        </template>
      </el-table-column>
    </el-table>
</div>
</template>

<script>
// 引入相关的依赖
import { CustomViewer } from "@/components/customBpmn";
import tools from "@/api/workflow/tools";
import ins from "@/api/camunda/ins";
import matouFunc from "@/utils/matouFunc";

export default {
  mounted() {
    this.init();
  },
  data() {
    return {
      bpmnModeler: null,
      container: null,
      canvas: null,
      comments:[]
    };
  },
  // 方法集合
  methods: {
    getcnname(name){
      return matouFunc.renamebyCN(name)
    },
    timeStampToDhms(time){
      return matouFunc.timeStampToDhms(time)
    },
    init() {
        this.bpmnViewer = new CustomViewer({
            container: this.$refs.canvas
        });
        this.createNewDiagram()
    },
    async createNewDiagram() {
        const insId = this.$route.query.insId
        const procDefId = this.$route.query.procDefId
        if (insId) {
            tools.getBpmnXml({ procDefId : procDefId }).then((xmlStr) => {
                
                this.bpmnViewer.importXML(xmlStr);
                const canvas = this.bpmnViewer.get("canvas");
                canvas.zoom("fit-viewport", screenLeft);

                ins.getHighLightNodes({insId:insId,procDefId:procDefId}).then((highLightNodes)=>{
                    console.log(highLightNodes);
                    
                    this.comments = highLightNodes.comments
                    this.success(highLightNodes);
                })
            })
            .catch((error) => {
                this.$message.error('获取流程信息失败');
            });
        }
    },
    success(nodes) {
      this.setColor(nodes);
      // this.getParms();
      this.addEventBusListener();
    },
    setColor(nodes) {
        const canvas = this.bpmnViewer.get("canvas");
        console.log(nodes)
        //分别循环高亮
        nodes.waitingTodo.forEach(e => {
            canvas.addMarker(e,"waitingTodo")
        });
        nodes.highLine.forEach(e => {
            canvas.addMarker(e,"highLine")
        });
        nodes.highPoint.forEach(e => {
            canvas.addMarker(e,"highPoint")
        });
        nodes.myNodes.forEach(e => {
            canvas.addMarker(e,"myNodes")
        });
        
    },
    getParms() {
      // 获取节点属性
      console.log(
        "123",
        this.bpmnViewer.get("elementRegistry").get("Activity_0o8b5cf")
          .businessObject.$attrs
      );

      // 获取上一个节点的类型
      console.log(
        "234",
        this.bpmnViewer.get("elementRegistry").get("Flow_1d9q74f")
          .businessObject.sourceRef.$type
      );
    },
    addEventBusListener() {
      const that = this;
      const eventBus = this.bpmnViewer.get("eventBus");

      eventBus.on("element.click", function(e) {
        console.log(
          "点击了element",
          e.element.businessObject.id,
          e.element.businessObject.$type,
          e.element.businessObject.name
        );
      });
    }
  },

};
</script>

<style>
#comments{
  /* height: 20vh; */
}
.containers {
  background: white;
  overflow: auto;
  background-image: linear-gradient(
      90deg,
      rgba(220, 220, 220, 0.5) 6%,
      transparent 0
    ),
    linear-gradient(rgba(192, 192, 192, 0.5) 6%, transparent 0);
  background-size: 12px 12px;
  width: 100%;
  height: 500px;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}
.canvas {
  width: 95%;
  height: 500px;
}

.highPoint .djs-visual > :nth-child(1) {
    stroke: green !important;
    fill: rgba(0, 80, 0, 0.4) !important;
}
.waitingTodo .djs-visual > :nth-child(1) {
  stroke: rgb(255, 0, 0) !important;
  fill: rgba(255, 255, 255, 0.4) !important;
}
.myNodes .djs-visual > :nth-child(1) {
  stroke: rgb(255, 196, 0) !important;
  fill: rgba(255, 196, 0, 0.4) !important;
}
/* 连线 */
.highLine .djs-visual > :nth-child(1) {
    stroke: green !important;
}
</style>
