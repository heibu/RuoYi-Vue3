<template>
    <div class="processDrawBody">
        <div class="containerBox" style="position: relative;">
            <div id="container"></div>
            <div id="js-properties-panel" class="panel"></div>
        </div>
        <el-button-group>
            <el-button size="mini" @click="showProcessInfo">xml数据</el-button>
            <el-button type="primary" size="mini" @click="handleUndo">撤销</el-button>
            <el-button type="success" size="mini" @click="handleRedo">恢复</el-button>
            <el-button type="warning" size="mini" @click="handleDownload">下载</el-button>
            <el-button type="success" size="mini" @click="save">部署</el-button>
            <el-button type="primary" size="mini" @click="this.open=true">设置流程类别</el-button>
            <el-upload
                    style="display: inline-block;"
                    :file-list="fileList"
                    class="upload-demo"
                    action=""
                    :auto-upload="false"
                    :show-file-list="false"
                    :http-request="httpRequest"
                    :on-change="handleOnchangeFile"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
            >
                <el-button type="danger" size="mini">导入</el-button>
            </el-upload>
        </el-button-group>
        <!-- 流程分类设置对话框 -->
        <el-dialog :title="title" v-model="open" width="600px" append-to-body>
         <el-form label-width="80px">

            <el-row>
               <el-col :span="12">
                  <el-form-item label="流程类别">
                     <el-select v-model="bpmnCategory" placeholder="请选择">
                        <el-option value="分中心临时工作">分中心临时工作</el-option>
                        <el-option value="省中心临时工作">省中心临时工作</el-option>
                        <el-option value="业务活动">业务活动</el-option>
                        <el-option value="业务培训">业务培训</el-option>
                        <el-option value="工作计划">工作计划</el-option>
                        <el-option value="固定工作">固定工作</el-option>
                        <el-option value="日常办公">日常办公</el-option>
                        <el-option value="渠道管理">渠道管理</el-option>
                     </el-select>
                  </el-form-item>
               </el-col>
            </el-row>
         </el-form>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitForm">确 定</el-button>
               <el-button @click="cancel">取 消</el-button>
            </div>
         </template>
      </el-dialog>
    </div>
</template>
<script>
    import { markRaw } from 'vue';
    // bpmn-js相关
    import 'bpmn-js/dist/assets/diagram-js.css';
    import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
    import BpmnModeler from 'bpmn-js/lib/Modeler';
    // bpmn-js-properties-panel相关
    import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
    import propertiesPanelModule from 'bpmn-js-properties-panel'
    import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
    import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
    // 其他
    import customTranslate from '@/plugins/bpmn-translate/customTranslate'
    import tools from "@/api/workflow/tools";
    export default {
        props: ['deploymentId'],
        data() {
            return {
                containerEl: null,
                bpmnModeler: null,
                fileList: [],
                bpmnCategory:"默认分类",
                open:false,
                title : "设置流程属性",
            };
        },
        mounted() {
            // 初始化流程图
            this.init();
        },
        methods: {
            /**
             * 初始化流程图
             */
            init() {
                // =====================
                const procDefId = this.$route.query.procDefId
                if (procDefId) {
                    tools.getBpmnXml({procDefId:procDefId}).then((res) => {
                        // console.log(res)
                        this.bpmnModeler.importXML(res, (err) => {
                            this.$message.success('流程图加载成功！');
                        });
                    })
                    .catch((error) => {
                        this.$message.error('获取流程信息失败');
                    });
                }
                // ==============
                this.containerEl = document.getElementById('container');
                //汉化
                const customTranslateModule = {
                    translate: [ 'value', customTranslate]
                    };
                // console.log(customTranslate)
                // 加markRaw去除双向绑定作用域
                this.bpmnModeler = markRaw(new BpmnModeler({
                    container: this.containerEl,
                    // 添加控制板
                    propertiesPanel: {
                        parent: '#js-properties-panel'
                    },
                    // 右侧属性面板
                    additionalModules: [
                        propertiesPanelModule,
                        propertiesProviderModule,
                        customTranslateModule
                    ],
                    moddleExtensions: {
                        camunda: camundaModdleDescriptor
                    }
                }));
                this.bpmnModeler.createDiagram(() => {
                    this.bpmnModeler.get('canvas').zoom('fit-viewport');
                });
                // let _this = this;
                // // 如果deploymentId存在，则为编辑，导入xml信息
                // if (_this.deploymentId) {
                //     tools.getProcessXml({"deploymentId":_this.deploymentId})
                //         .then((res) => {
                //             _this.bpmnModeler.importXML(res.data, (err) => {
                //                 this.$message.success('加载成功！');
                //             });
                //         })
                //         .catch((error) => {
                //             this.$message.error('获取流程信息失败');
                //         });
                // }
            },
            handleRemove(file) {
                for (let i = 0; i < this.fileList.length; i++) {
                    if (file.name === this.fileList[i].name) {
                        this.fileList.splice(i, 1);
                    }
                }
            },
            beforeRemove(file) {
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            // 后退
            handleUndo() {
                this.bpmnModeler.get('commandStack').undo();
            },
            // 前进
            handleRedo() {
                this.bpmnModeler.get('commandStack').redo();
            },
            // 下载
            handleDownload() {
                this.bpmnModeler.saveXML({format: true}, (err, data) => {
                    const dataTrack = 'bpmn';
                    const a = document.createElement('a');
                    const name = `diagram.${dataTrack}`;
                    a.setAttribute(
                        'href',
                        `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`
                    );
                    a.setAttribute('target', '_blank');
                    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
                    a.setAttribute('download', name);
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            },
            // 导入成功回调
            handleOnchangeFile(file) {
                const reader = new FileReader();
                let data = '';
                reader.readAsText(file.raw);
                reader.onload = (event) => {
                    data = event.target.result;
                    this.bpmnModeler.importXML(data, (err) => {
                        debugger
                        if (err) {
                            this.$message.info('导入失败');
                        } else {
                            this.$message.success('导入成功');
                        }
                    });
                };
            },
            // 取xml信息，展示当前BPMN图的XMl源码
            showProcessInfo() {
                this.bpmnModeler.saveXML({format: true}, (err, data) => {
                    console.log(data)
                    // let parser=new DOMParser();
                    // let xmlDoc=parser.parseFromString(data,"text/xml");

                    // console.log(xmlDoc);
                    // xmlDoc.getElementsByTagName("bpmn:definitions")[0].setAttribute("targetNamespace","child");
                    // console.log(xmlDoc.getElementsByTagName("bpmn:definitions")[0].attributes['targetNamespace']);
                    // console.log(xmlDoc.getElementsByTagName("bpmn"));
                });
            },
            /**
             * 保存、部署
             */
            save() {
                this.bpmnModeler.saveXML({format: true}, (err, data) => {
                    let processInfo = {};
                    // 将string转为XML，并处理
                    let parser=new DOMParser();
                    let xmlDoc=parser.parseFromString(data,"text/xml");
                    xmlDoc.getElementsByTagName("bpmn:definitions")[0].setAttribute("targetNamespace",this.bpmnCategory);
                    // 将XML转换为string
                    var string = (new XMLSerializer()).serializeToString(xmlDoc)

                    processInfo.xmlstring = string;
                    processInfo.deploymentName = document.getElementById("camunda-name").innerHTML;
                    console.log(processInfo)
                    tools.processDeployment(processInfo)
                        .then((res) => {
                            this.$message.success('流程图部署成功！');
                            console.log(res.msg);
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
            },
            /** 导入按钮操作 */
            setCategory() {
                category.title = "设置流程分类";
                dialog.open = true;
            },
            submitForm(){
                this.open = false
                // alert(this.bpmnCategory)
            },
            cancel(){
                this.open =false;
            }
        }
    }
</script>
<style>
    .processDrawBody {
        height: 100%;
        text-align: left;
    }
    .containerBox {
        height: 88vh;
    }
    .containerBox #container {
        height: 100%;
        /* border: 1px solid rgb(121, 121, 121); */
    }
    .bpp-properties-panel [type=text] {
        box-sizing: border-box;
    }
    .panel {
        width: 400px;
        position: absolute;
        top: 1px;
        right: 1px;
        height:100%;
        overflow: auto;
        font-weight: 100;
        font-size: 8px;
    }
    .bpp-properties-group .group-header {
        padding: 2px 3px;
    }
    .bpp-properties-group .group-header .group-label{
        font-weight:bold;
        font-size: 14px;
    }
    /* 右下角logo */
    .bjs-powered-by {
        display: none;
    }
</style>