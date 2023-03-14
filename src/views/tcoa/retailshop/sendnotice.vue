<template>
<div class="app-container">
    <el-container id="container">
      <el-header id="header"><H1>实体店信息通知单</H1></el-header>
      <el-container>
        <el-aside width="260px">
                <span label="添加网点">添加网点</span>
                <el-input v-model="shopsn" placeholder="实体店编号回车" clearable @keyup.enter="addshop" >
                    <template #prepend>4114</template>
                </el-input>
                <el-button type="primary" @click="addshop" style="margin-top: 10px;">添加网点</el-button>
                <el-button type="warning" @click="sendnotice" style="margin-top: 10px;">发送通知</el-button>
        </el-aside>
        <el-main>
            <!-- {{noticeform}} -->
            <el-form :label-position="labelPosition" label-width="100px" :model="noticeform" style="max-width: 460px" >
                <el-form-item label="网点列表">
                    <el-input v-model="noticeform.shoplist" type="textarea" clearable="true" style="font-size: medium;"  />
                </el-form-item>
                <el-form-item label="扣除分值" v-if="noticeform.noticetype=='违规通知'">
                    <el-input v-model="noticeform.depoints" type="number" style="font-size: medium;" />
                </el-form-item>
                <selectPlugin labeltext="通知类别" :defaultvalue="selectPlugin_conf.noticetpye.defaultvalue" :options="selectPlugin_conf.noticetpye.options" v-model:value="noticeform.noticetpye"></selectPlugin>
                <el-form-item label="通知内容">
                    <el-input v-model="noticeform.noticecontent" type="textarea" style="font-size: medium;" />
                </el-form-item>
                <el-form-item label="上传图片">
                    <el-upload
                        v-model:file-list="noticeform.pics"
                        action=""
                        list-type="picture-card"
                        :before-upload="beforeuploadfile"
                        :on-progress = "uploadtocos"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                    >
                        <el-icon><Plus /></el-icon>
                    </el-upload>
    
                    <el-dialog v-model="dialogVisible">
                        <img :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </el-form-item>
            </el-form>
        </el-main>
      </el-container>
    </el-container>
</div>
</template>

<script setup>
    import selectPlugin from "@/components/tcoa/search-select"
    import matouFunc from "@/utils/matouFunc"
    import {cosUpload,cosSingleDel} from '@/utils/uploadCos'
    import send from '@/api/tcoa/sendnotice'
    const uploadFile=ref()
    const selectPlugin_conf = {
        noticetpye:{
            options:[{value:'违规通知'},{value:'生日祝福'},{value:'销售提醒'},{value:'其他'}],
            defaultvalue:'违规通知'
        }
    }
    const store = useStore()
    const shopsn = ref()
    const noticeform = ref({
        shoplist:[],
        noticetype:'违规通知',
        depoints:0,
        pics:[],
        sender:matouFunc.renamebyCN(store.state.user.name)
    })
    //添加网点
    const addshop = ()=>{
        noticeform.value.shoplist.push("4114"+shopsn.value)
    }
    //图片上传功能
    const beforeuploadfile =(file)=>{
        uploadFile.value = file
    }
    const uploadtocos = ()=>{
        cosUpload(uploadFile.value , (res) => {
            if(res){
                noticeform.value.pics.push({
                    url:"https://"+res.Location
                })
            }
        })
    }
    //图片预览功能
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const handlePictureCardPreview = (uploadFile)=>{
        dialogImageUrl.value = uploadFile.url
        dialogVisible.value = true
    }
    //发送通知
    const sendnotice = ()=>{
        send.rspointsNotice(noticeform.value).then((res)=>{
            console.log(res)
        })
    }
</script>
<style scoped>
.app-container {
    height: calc(100vh - 84px);
    background-image: radial-gradient(circle,#66d1d1, #fbffeb);
}
#container{
    border: #99CCCC 1px solid;
    width: 900px;
    margin: auto;
    border-radius: 25px;
    overflow:hidden;
}
#header{
    text-align: center;
    height: 80px;
    font-size: 25px;
    background-color:rgb(205, 241, 255);
}
</style>