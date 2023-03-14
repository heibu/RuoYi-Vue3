<template>
    <el-form-item  :label="labeltext">
        <el-select v-model="value" class="m-2" placeholder="选择" @change="selected">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
    </el-form-item>
</template>

<script setup>
    const { props } = getCurrentInstance();
    // console.log(getCurrentInstance())
    defineProps({
        labeltext:{
           type : String,
           default:"请选择"
        },
        options:{
            type : Object,
            default:[]
        },
        defaultvalue:{
            type : String,
            default:''
        },
    })
    const value = ref(props.defaultvalue)
    const emit = defineEmits()
    const selected = ()=>{
        emit('update:value',value.value)
    }
</script>
