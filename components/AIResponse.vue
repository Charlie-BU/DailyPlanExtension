<template>
    <div class="ai-response-container" :class="{ visible: isVisible }">
        <!-- <div class="ai-avatar">
            <div class="avatar-circle">AI</div>
        </div> -->
        <div class="message-bubble">
            <div class="typing-indicator" v-if="isTyping">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="message-content" v-else>
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const isTyping = ref(true);
const isVisible = ref(false);

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
});

watch(
    () => props.message,
    (newMessage) => {
        // 当消息为空或变更时，显示加载动画
        if (newMessage === "waiting") {
            isTyping.value = true;
            return;
        }

        // 如果是新消息，先显示加载动画
        if (newMessage !== "waiting") {
            isTyping.value = true;
            // 短暂延迟后再显示内容，给用户更好的视觉反馈
            setTimeout(() => {
                isTyping.value = false;
            }, 500);
        }
    },
    { immediate: true }
);

onMounted(() => {
    // 添加入场动画
    setTimeout(() => {
        isVisible.value = true;
    }, 100);
});
</script>

<style lang="scss" scoped>
.ai-response-container {
    display: flex;
    gap: 12px;
    margin: 16px 0;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    animation: messageFadeIn 0.4s ease forwards;

    &.visible {
        opacity: 1;
        transform: translateY(0);
    }
}

.ai-avatar {
    .avatar-circle {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #00b4db, #0083b0);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.message-bubble {
    background-color: transparent;
    padding: 12px 16px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    max-width: 100%;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.95) translateY(10px);
    animation: messageFadeIn 0.4s ease forwards;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        transform: translateY(-1px);
    }
}

.typing-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 0;

    span {
        width: 6px;
        height: 6px;
        background: #2196f3;
        border-radius: 50%;
        opacity: 0.6;
        animation: pulse 1s infinite;

        &:nth-child(1) {
            animation-delay: -0.4s;
        }
        &:nth-child(2) {
            animation-delay: -0.2s;
        }
        &:nth-child(3) {
            animation-delay: 0s;
        }
    }
}

@keyframes pulse {
    0%,
    100% {
        transform: scale(0.4);
        opacity: 0.3;
    }
    50% {
        transform: scale(1);
        opacity: 0.8;
    }
}

@keyframes messageFadeIn {
    0% {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.message-content {
    color: #333;
    line-height: 1.5;
    white-space: pre-wrap;
}
</style>
