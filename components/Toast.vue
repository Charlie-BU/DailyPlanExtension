<template>
    <transition name="fade">
        <div v-if="visible" class="custom-toast" :class="type">
            {{ message }}
        </div>
    </transition>
</template>

<script setup>
import { ref } from "vue";

const visible = ref(false);
const message = ref("");
const type = ref("");

// 显示 Toast 的方法
const showToast = (msg, toastType = "default", duration = 2000) => {
    message.value = msg;
    type.value = toastType;
    visible.value = true;

    // 过一段时间自动关闭
    setTimeout(() => {
        visible.value = false;
    }, duration);
};

// 让外部可以调用
defineExpose({ showToast });
</script>

<style scoped>
.custom-toast {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background-color: #333;
    color: white;
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: opacity 0.3s ease;
    white-space: nowrap;
}

.custom-toast.default {
    background-color: #333;
}

.custom-toast.success {
    background-color: #4caf50;
}

.custom-toast.error {
    background-color: #f44336;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
