<template>
<div id="app">
    <VueForm v-model="formData" :ui-schema="uiSchema" :form-footer="formFooter" :schema="schema" @submit="handlerSubmit">
        <template v-slot="{ formData, formRefFn }">
            <el-upload
                ref="uploadRef"
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :auto-upload="false"
            >

                <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                </template>
                <el-button class="ml-3" type="success" @click="submitUpload">
                    上传到服务器
                </el-button>

                <template #tip>
                    <div class="el-upload__tip">
                        jpg/png files with a size less than 500kb
                    </div>
                </template>
            </el-upload>
            <pre style="background-color: #eee;">{{ JSON.stringify(formData.value, null, 4) }}</pre>
            <el-input v-model="formData.value.namess" placeholder="Please input" />
            <el-button @click="console(formRefFn)" type="primary">不同意</el-button>
            <el-button type="danger">驳回</el-button>
            <el-button type="warning">同意</el-button>
        </template>
    </VueForm>
</div>
</template>

<script>
import VueForm from '@lljj/vue3-form-element';
export default {
    name: 'Demo',
    components: {
        VueForm
    },
    methods:{
        console:function(r){
            console.log(r)
        },
        note:function(){
            alert("r")
        },
        uploadpic:function(UploadFile){
            console.log(UploadFile)
            this.formData.imgUrl="aaaa"
            alert(this.formData.imgUrl)
        }
    },
    data() {
        return {
            formData: {
                number: 1,
                numberEnumRadio: 2,
                integerRange: 50,
                imageurl:""
                // namess:"a"
            },
            schema: {
                type: 'object',
                properties: {
                    imgUrl: {
                        "title": "单个图片",
                        "type": "string",
                        "default": "http://img.alicdn.com/tfs/TB1vYlkdnZmx1VjSZFGXXax2XXa-468-644.jpg_320x5000q100.jpg_.webp",
                        "ui:action": "#666",
                        "ui:widget": "UploadWidget",
                        "ui:btnText": "上传按钮文案配置",
                        "ui:list-type": "picture-card",
                        "ui:auto-upload": false,
                        "ui:onChange":() => this.uploadpic(UploadFile)
                    },
                    firstName: {
                        type: 'string',
                        title: 'First name',
                        'ui:placeholder': '请输入FirstName（配置在schema中）'
                    },
                    bio: {
                        type: 'string',
                        title: 'Bio',
                        minLength: 10,
                        'ui:options': {
                            type: 'textarea',
                            placeholder: 'placeholder（配置在schema中）',
                            rows: 2
                        }
                    },
                    inputText: {
                        title: 'Input Text',
                        type: 'string'
                    },
                    number: {
                        title: 'Number (默认渲染组件)',
                        type: 'number'
                    },
                    integerRange: {
                        title: 'Integer range (使用 ElSlider)',
                        type: 'integer',
                        minimum: 42,
                        maximum: 100
                    }
                }
            },
            uiSchema: {
                'ui:order': ['number', '*'],
                inputText: {
                    'ui:description': '这里重置了描述信息',
                    'ui:emptyValue': '',
                    'ui:options': {
                        style: {
                            boxShadow: '0 0 6px 2px #2b9939'
                        },
                        class: {
                            className_hei: true
                        },
                        type: 'textarea',
                        autofocus: true,
                        rows: 2,
                        placeholder: '请输入你的内容'
                    }
                },
                number: {
                    'ui:title': '这里重置了标题'
                },
                integerRange: {
                    'ui:widget': 'el-slider',
                }
            }
        }
    }
};
</script>
<style scoped>
#app{
    padding: 50px 100px;
}
</style>