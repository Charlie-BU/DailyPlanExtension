<template>
    <van-cell-group inset>
        <!-- 输入任意文本 -->
        <van-field v-model="baseUrl" label="接口地址" />
        <van-field v-model="apiKey" label="API KEY" />
        <van-field v-model="model" label="模型" />
    </van-cell-group>
    <van-button type="primary" @click="save">保存设置</van-button>
</template>

<script setup>
import { storage } from "wxt/storage";
const baseUrl = ref("");
const apiKey = ref("");
const model = ref("");

const save = async () => {
    console.log(baseUrl.value, apiKey.value, model.value);
    if (!!baseUrl.value || !!apiKey.value || !!model.value) {
        await storage.setItem("local:settings", {
            baseUrl: baseUrl.value,
            apiKey: apiKey.value,
            model: model.value,
        });
    }
    let settings = await storage.getItem("local:settings");
    console.log("7777", settings);
};
</script>

<style scoped></style>
