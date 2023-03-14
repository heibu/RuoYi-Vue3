<template>
<div class="app-container">
    <el-form :inline="true" label-width="68px" @submit.native.prevent>
        <el-form-item label="网点编号" >
        <el-input
            v-model="shopsn"
            placeholder="请输入实体店编号"
            clearable
            @keyup.enter="handleQuery"
        />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">查询</el-button>
            
        </el-form-item>
    </el-form>
    <el-row :gutter="20">
        <el-col :span="16">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>基础信息</span>
                        <el-button type="warning" icon="Edit" style="margin-left: 20px;height:25px" @click="editDisable=!editDisable">编辑</el-button>
                    </div>
                </template>
                <div class="shopinfo_item">
                    <span class="labelspan">专管员</span>
                    <el-input v-model="shopinfo.area_manager" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">业主电话</span>
                    <el-input v-model="shopinfo.shop_tel" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">剩余积分</span>
                    
                    <el-progress :percentage="shopinfo.shop_points/12*100" stroke-width ="20" style="display:block;height: 20px;" />
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">网点地址</span>
                    <el-input v-model="shopinfo.shop_addr" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">行政区域</span>
                    <el-input v-model="shopinfo.region" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">网点状态</span>
                    <el-input v-model="shopinfo.status" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">开店时间</span>
                    <el-input v-model="shopinfo.create_time" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">经营类别</span>
                    <el-input v-model="shopinfo.business_type" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">竞彩类型</span>
                    <el-input v-model="shopinfo.sporlot_type" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">渠道类别</span>
                    <el-input v-model="shopinfo.channel_type" :disabled="!editDisable" />    
                </div>
                <div class="shopinfo_item">
                    <span class="labelspan">销售代表</span>
                    <el-input v-model="shopinfo.manager_assistant" :disabled="!editDisable" />    
                </div>
                <div class="card-footer">
                    <el-button type="primary" icon="Edit" v-if="editDisable">提交修改</el-button>
                </div>
            </el-card>

        </el-col>
        <el-col :span="8">
            <el-card class="box-card" style="background-color: rgb(72, 209, 141); color: aliceblue;">
                <template #header>
                    <div class="card-header">
                        <span>业主信息</span>
                    </div>
                </template>
                <div id="agentinfo">
                    <h1>{{agentinfo.name}}</h1>
                    <div>电话：{{agentinfo.tel}}</div>
                    <div>身份证：{{agentinfo.idcard}}</div>
                </div>
            </el-card>
            <el-card class="box-card" style="background-color: rgb(133, 111, 200); color: aliceblue;">
                <template #header>
                    <div class="card-header">
                        <span>开店记录</span>
                    </div>
                </template>
                <el-table :data="agentshoplist" border style="width: 100%">
                    <el-table-column prop="shopsn" label="网点编号" />
                    <el-table-column prop="create_time" label="开店时间"  />
                    <el-table-column prop="region" label="区域" />
                </el-table>
            </el-card>
            <el-card class="box-card" style="background-color: rgb(133, 149, 244); color: aliceblue;">
                <template #header>
                    <div class="card-header">
                        <span>积分记录</span>
                    </div>
                </template>
                <el-table :data="shopPointsRecords" border style="width: 100%">
                    <el-table-column prop="depoints" label="分值" width="60" />
                    <el-table-column prop="createdate" label="扣分时间" width="100" />
                    <el-table-column prop="reason" label="扣分原因" />
                </el-table>
            </el-card>
            <el-card class="box-card" style="background-color: rgb(133, 149, 244); color: aliceblue;">
                <template #header>
                    <div class="card-header">
                        <span>培训记录</span>
                    </div>
                </template>
                <i class="el-icon" data-v-55fe6a7a="" style="font-size: 70px; color: rgb(146, 161, 244);"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M224 128v704h576V128H224zm-32-64h640a32 32 0 0 1 32 32v768a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32z"></path><path fill="currentColor" d="M64 832h896v64H64zm256-640h128v96H320z"></path><path fill="currentColor" d="M384 832h256v-64a128 128 0 1 0-256 0v64zm128-256a192 192 0 0 1 192 192v128H320V768a192 192 0 0 1 192-192zM320 384h128v96H320zm256-192h128v96H576zm0 192h128v96H576z"></path></svg></i>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script setup>
import rs from '@/api/tcoa/retailshop'
import { onBeforeMount } from 'vue';
const {proxy} = getCurrentInstance();
//需要url传递的参数有editDisable\shopsn
const editDisable = ref(proxy.$route.query.editDisable)
const shopsn = ref(proxy.$route.query.shopsn)
const shopinfo = ref({
    shopsn:'',
    shop_addr:'',
    region:'',
    status:'',
    create_time:'',
    sporlot_type:'',
    business_type:'',
    channel_type:'',
    manager_assistant:'',
    agent_idcard:''
})
const agentinfo = ref({
    name:'',
    tel:'',
    agent_idcard:''
})
const agentshoplist = ref([])
const shopPointsRecords = ref([])
const handleQuery = async ()=>{
    await rs.getShopDetail({shopsn:shopsn.value}).then((res)=>{
        console.log(res)
        shopinfo.value = res
        console.log(shopinfo.value.agent_idcard)
    })
    await rs.getAgentDetail({agent_idcard:shopinfo.value.agent_idcard}).then((ress)=>{
        console.log(shopinfo.value.agent_idcard)
        agentinfo.value = ress
    })
    rs.getAgentShoplist({agent_idcard:shopinfo.value.agent_idcard}).then((ress)=>{
        agentshoplist.value = ress.data
        console.log(agentshoplist.value[0])
    })
    rs.getShopPointsRecords({shopsn:shopsn.value}).then((res)=>{
        console.log(res)
        shopPointsRecords.value = res.data
    })
}

handleQuery()
</script>
<style scoped>

.labelspan{
    width: 100px;
    font-weight: bold;
}
.card-footer{
    margin-top: 15px;
}
.shopinfo_item{
    display:flex;
    margin-top: 25px;
    align-items: center;
}
.box-card{
    margin-bottom: 20px;
}
#agentinfo{
    text-align: center;
}
</style>