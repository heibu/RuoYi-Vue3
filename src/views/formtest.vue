<template>
<div id="app">
    <div v-for="c in testdata">[{{c.work}}]--[{{c.timer}}]--[{{c.zhixing}}]
    <hr>
    </div>
     <VueForm v-model="formData" :ui-schema="uiSchema" :form-footer="formFooter" :schema="schema" @submit="handlerSubmit"/>
</div>
</template>

<script>
import VueForm from '@lljj/vue3-form-element';
import tools from '@/api/workflow/tools'
import {cosUpload} from '@/utils/uploadCos'
export default {
    name: 'Demo',
    components: {
        VueForm
    },
    mounted(){
        console.log(tools.getAllRegularjob)
        tools.getAllRegularjob().then((r)=>{
            console.log(r)
            this.testdata = r.data
        })
    },
    methods:{
        uploadChange: async function(file,fileList){
            document.getElementsByClassName('el-upload')[0].style.display="none"
            if (!file.name) {
                this.$message({
                    message: '未发现文件，请重新选择',
                    type: 'warning',
                });
            } else {
                this.checkfile(file)
                // this.$confirm('请确认是否要上传？', '提示', {
                //     type: 'warning',
                // }).then(() => {
                // });
            }
        },
        uploadRemove:function(file){
            //todo cos删除文件
            document.getElementsByClassName('el-upload')[0].style.display="block"
        },
        // 上传前校验
        checkfile:async function(file) {
            var testmsg = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            // if (this.uploadpicTypes.indexOf(testmsg) < 0) {
            //     this.$message({
            //     message: testmsg + '类型文件不可上传，请重新选择',
            //         type: 'warning',
            //     });
            //     return false;
            // }
            let uploadpicTypesArr = this.uploadpicTypes.split(',');
            // 判断文件是否符合要求
            if (uploadpicTypesArr.indexOf(testmsg) < 0) {
                this.$message({
                    message: '上传文件只能是' + this.uploadpicTypes + '格式!',
                    type: 'warning',
                });
                return false;
            } else if (file.size / 1024 / 1024 > 10) {
                this.$message({
                    message: '上传文件过大，大小不可超过10M!',
                    type: 'warning',
                });
                return false;
            } else {
                cosUpload(file,res => {// 有返回值也就是res存在，就代表uploadCos.js文件里的             
                // --> callback(fileUrl)中的fileUrl存在，也就是说data有值，即上传成功。
                    
                    if(res){
                        this.$message.success('上传成功')
                    }
                    console.log("res:"+res)
                })
            }
        }
    },
    data() {
        return {
            testdata:{},
            uploadpicTypes:'.jpg,.png',
            formData: {
                number: 1,
                numberEnumRadio: 2,
                integerRange: 50,
                imageurl:""
            },
            schema: {
                type: 'object',
                properties: {
                    imgUrl: {
                        "ui:ref":"upload",
                        "title": "上传图片",
                        "type": "string",
                        "ui:accept":"image/png, image/jpeg",
                        "ui:class":"upload",
                        "ui:widget": "UploadWidget",
                        "ui:list-type": "picture-card",
                        "ui:auto-upload": 0,
                        "ui:on-change":(file,fileList) => this.uploadChange(file,fileList),
                        "ui:onChange":(file) => this.uploadRemove(file),
                    }
                }
            },
            uiSchema: {
            }
        }
    }
};
</script>
<style>
#app{
    padding: 50px 100px;
}
.el-upload{
    height: 146px;
    width: 146px;
    background-image: url("/src/assets/images/profile.jpg") ;
    background-size:100% 100%;
    background-color: rgb(175, 220, 247);
}
.el-upload>button{
    background-color: rgba(0, 0, 0, .2);
    width: 100%;
    height: 30px;
    margin-top: 75px;
}
</style>