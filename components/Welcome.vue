<template>
    <div
        class="custom-panel"
        ref="panel"
        @mousedown="startDrag"
        :style="{ left: position.x + 'px', top: position.y + 'px' }">
        <div class="title">
            <span class="title-icon">🌟</span>
            我要做计划AI插件
            <span class="title-icon">✨</span>
        </div>

        <div v-if="aiResponse" class="responses-container">
            <AIResponse :message="aiResponse" />
        </div>

        <div class="bottom-button">
            <button class="general-button test-api" @click="() => callAPI()">
                <i class="button-icon">🔍</i>
                测试API
            </button>
            <button
                class="general-button analyze"
                @click="() => summerizeMonthPlan()">
                <i class="button-icon">📊</i>
                当月计划分析
            </button>
            <button
                class="general-button character"
                @click="() => depictCharacter()">
                <i class="button-icon">👤</i>
                个人形象刻画
            </button>
            <button
                class="general-button optimize"
                @click="() => optimizePlanToday()">
                <i class="button-icon">✨</i>
                当日计划优化
            </button>
            <button class="drag-handle">
                <i class="button-icon">↔️</i>
                拖拽
            </button>
        </div>
    </div>
</template>

<script setup>
import { watch, ref, onMounted, onBeforeUnmount } from "vue";
import { ask } from "../entrypoints/background/index";
import AIResponse from "./AIResponse.vue";
import { useDebounceFn } from "@vueuse/core";

const props = defineProps({
    allData: {
        type: Object,
        required: true,
    },
});
const allMonthPlans = ref(null);

// 更新响应式数据
watch(
    () => props.allData,
    (newData) => {
        allMonthPlans.value = newData?.allMonthPlans?.value;
        // console.log(allMonthPlans.value);
    },
    { deep: true }
);

const aiResponse = ref("");

// 添加节流控制
const lastCallTime = ref(0);
const MIN_INTERVAL = 2000; // 最小调用间隔

const callAPI = async (thisPrompt = "这是一条测试prompt") => {
    const now = Date.now();
    if (now - lastCallTime.value < MIN_INTERVAL) {
        aiResponse.value = "请稍等片刻再试...";
        return;
    }
    lastCallTime.value = now;
    aiResponse.value = "waiting";
    try {
        const response = await ask(thisPrompt);
        aiResponse.value = response.choices[0].message.content;
    } catch (error) {
        console.error("API调用出错:", error);
        aiResponse.value = "抱歉，发生了一些错误，请稍后再试。";
    }
};

const constructInitPrompt = (extraWords) => {
    let prompt = `我的本月计划如下，${extraWords}，写成纯文本而不是markdown格式；直接告诉我内容，不要开场白：\n\n`;
    for (const each of allMonthPlans.value) {
        prompt += `日期：${each.date}\n已完成计划：${each.plansFinished}\n未完成计划：${each.plansUnfinished}`;
    }
    return prompt;
};

const summerizeMonthPlan = useDebounceFn(async () => {
    const prompt = constructInitPrompt(
        "请帮我对本月计划进行总结，包括完成与未完成比例、本月个人状态、近日个人状态等"
    );
    await callAPI(prompt);
}, 1000);

const depictCharacter = useDebounceFn(async () => {
    const prompt = constructInitPrompt(
        "请根据计划内容刻画我的个人形象，越详细越好"
    );
    await callAPI(prompt);
}, 1000);

const optimizePlanToday = useDebounceFn(async () => {
    const today = new Date();
    const todayString = `${today.getFullYear()}年${
        today.getMonth() + 1
    }月${today.getDate()}日`;
    const prompt = constructInitPrompt(
        `今天是${todayString}，请综合之前和之后的计划内容对我今天（${todayString}）的计划进行优化，并给出合理理由`
    );
    await callAPI(prompt);
}, 1000);

// 拖拽相关逻辑
const position = ref({ x: 0, y: 0 });
const isDragging = ref(false);
const dragOffset = ref({ x: 0, y: 0 });
const panel = ref(null);

const startDrag = (e) => {
    // 只允许从拖拽区域开始拖拽
    if (!e.target.closest(".drag-handle")) return;
    isDragging.value = true;
    dragOffset.value = {
        x: e.clientX - position.value.x,
        y: e.clientY - position.value.y,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
};

const onDrag = (e) => {
    if (!isDragging.value) return;
    const newX = e.clientX - dragOffset.value.x;
    const newY = e.clientY - dragOffset.value.y;
    // 确保面板不会被拖出视口
    const maxX = window.innerWidth - panel.value.offsetWidth;
    const maxY = window.innerHeight - panel.value.offsetHeight;
    position.value = {
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY),
    };
};

const stopDrag = () => {
    isDragging.value = false;
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
};

// 组件卸载时清理事件监听
onBeforeUnmount(() => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
});
</script>

<style lang="scss" scoped>
.custom-panel {
    position: fixed;
    background: linear-gradient(135deg, #a6c1ee 0%, #fbc2eb 100%);
    max-height: 100vh;
    max-width: 400px;
    width: 350px;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
    z-index: 999;
    user-select: none;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
}

.title {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .title-icon {
        font-size: 24px;
        animation: bounce 2s infinite;
    }
}

.general-button {
    background: rgba(255, 255, 255, 0.25);
    padding: 12px 20px;
    margin-bottom: 12px;
    margin-right: 10px;
    text-align: center;
    border-radius: 15px;
    border: none;
    color: #2c3e50;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        background: rgba(255, 255, 255, 0.4);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: translateY(0);
    }

    .button-icon {
        font-style: normal;
    }
}

.bottom-button {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 20px;

    .drag-handle {
        background: rgba(255, 255, 255, 0.25);
        padding: 12px 20px;
        margin-bottom: 12px;
        margin-right: 10px;
        text-align: center;
        border-radius: 15px;
        border: none;
        color: #2c3e50;
        font-weight: 500;
        cursor: move;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        gap: 8px;

        &:hover {
            background: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.responses-container {
    margin: 20px 0;
    max-height: 300px;
    overflow-y: auto;
    padding: 15px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    backdrop-filter: blur(5px);
    animation: slideIn 0.3s ease-out;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.3);
        border-radius: 3px;

        &:hover {
            background: rgba(255, 255, 255, 0.4);
        }
    }
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

// 添加响应式设计
@media (max-width: 480px) {
    .custom-panel {
        width: 90%;
        max-width: none;
    }

    .general-button {
        width: 100%;
        margin-right: 0;
    }
}
</style>
