<template>
<div id="form">
  <!-- {{formData}} -->
  <!-- //toto formtooter 可以根据当前表单是否设置来显示，如果当前表单未设置，则用统一的footer -->
  <VueForm v-model="formData" :form-footer="formFooter" @cancel="handleCancel" :schema="schema" @submit="handlerSubmit" />
</div>
</template>


<script>
import VueForm from '@lljj/vue3-form-element';
import tools from "@/api/workflow/tools";
import ins from "@/api/camunda/ins"

export default {
    name: 'Demo',
    components: {
        VueForm
    },
    data() {
        return {
            formData: {},
            schema: {},
            defId:"",
            log:"",
            formKey:"",
            taskId:"",
            formFooter:{},
            insID:""
        };
    },
    async created(){
      console.log(this.taskId+this.formKey+this.defId)
      this.defKey=this.$route.query.defKey;
      this.formKey=this.$route.query.formKey;
      if(!this.formKey){
        //todo 可以修改成提交时（或保存草稿时）再创建流程实例，先获取formkey，提交variables后台从第一个用户任务开启实例，不提交则不保存
        const redata = await tools.getFormKeyByDefKey({defKey:this.defKey});
        this.formKey = redata.formKey
        this.taskId = redata.taskId
        this.insID = redata.insID
        console.log(redata)
      }
      tools.getTaskFormData(this.formKey).then(res=>{
        this.schema = res.schema
        this.formFooter = res.formFooter
        console.log(res)
        console.log(res.schema)
      });
    },
    methods:{
      /**
       * 提交表单，发起流程
       * 如果有taskid，说明从用户任务发起流程，如果没有，说明从startevent环节发起
       * 为了可以回退到第一步编辑，建议以后都从第一个用户任务发起
       */
      handlerSubmit(){
        let definfo = {defKey:this.defKey,variables:this.formData,taskId:this.taskId}
        tools.startInsByDefKey(definfo).then(res=>{
          this.$message.success("流程发起成功，请查看我发起的流程")
        });
        this.insID=""

        this.$router.push("/workflow/workflowModel");
      },
      handleCancel(){
        if(this.insID){
            ins.delDraftByinsID({insID:this.insID}).then(res=>{
              console.log(res);
            })
            this.insID = ""
        }
        this.$store.dispatch('tagsView/delView', this.$route);this.$router.go(-1);
      }

    },
    beforeUnmount(){
      if(this.insID){
          ins.delDraftByinsID({insID:this.insID}).then(res=>{
            console.log(res);
          })
      }
    },
    
};
</script>

<style lang='scss' scoped>
  #form{
    margin: 20px 50px;
    width: 80%;
  }
  
</style>
