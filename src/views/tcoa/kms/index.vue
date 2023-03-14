<template>
<div id="app">
	<div style="">
        <h2 style="text-align:center;margin-top:200px;">搜一下</h2>
		<span class="zySearch" id="zySearch">
            <!-- <b class="search-img" style="top: -30px;height: 30px;"></b> -->
            <input id="searchInput" class="search-input" type="text" placeholder="全文查询">
            <button class="search-btn btn" @click="search">搜索</button>
        </span>
	</div>
</div>
</template>

<script setup>
const { proxy } = getCurrentInstance();
function search(){
    proxy.$message.success("未完成")
}
</script>
<style scoped>
#app{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
}

.zySearch{
	float: left;
	top: 10px;
	position: relative;
	margin-left: auto;
	margin-right: auto;
}

.zySearch .search-img{ 
    background: url("./chicken.gif") no-repeat scroll left top transparent;
    display: block;
    height: 0;
    left: 39%;
    margin-left: -12px;
    position: absolute;
    top: 10px;
    width: 24px;
}

.zySearch .search-input{ 
	color: #999;
	border: 1px solid #D0D0D0;
    height: 50px;
    line-height: 33px;
    margin-right: 5px;
    padding: 0 10px;
    width: 666px;
}

.zySearch .search-btn{
    background: none repeat scroll 0 0 #F04243;
    border: 0 none;
    border-radius: 0;
    color: #FFFFFF;
    cursor: pointer;
    height: 50px;
    line-height: 33px;
    padding: 0;
    vertical-align: baseline !important;
    width: 100px;
    
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    margin-bottom: 0;
    font-weight: normal;
    font-size: 14px;
    display: inline-block;
    
    position: relative;
}

</style>